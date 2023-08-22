import { Photographer, Image, Video } from "./classes.js";

let params = new URL(document.location).searchParams;
let id = params.get("id");

export let mediaList = [];

async function getPhotographerData() {
  const response = await fetch("./data/photographers.json")
    .then((response) => response.json())
    .then((data) => data.photographers)
    .then((data) => data.find((photographer) => photographer.id == id))
    .catch((err) => console.log("an error", err));
  return response;
}

async function getMedias() {
  const response = await fetch("./data/photographers.json")
    .then((response) => response.json())
    .then((data) => data.media)
    .then((data) => data.filter((media) => media.photographerId == id))
    .catch((err) => console.log("an error", err));
  return response;
}

async function displayHeader(photographer) {
  const headerDOM = document.getElementById("photograph-header");
  headerDOM.innerHTML = `
        <div class="photographer-infos">
            ${photographer.getUserNameDOM()}
            ${photographer.getUserLocationDOM()}
            ${photographer.getUserTaglineDOM()}
        </div>
        <button id="contact_button">Contactez-moi</button>
        ${photographer.getUserPictureDOM()}
    `;
  initContactModal(photographer.name);
}

function initContactModal(name) {
  const modalBtn = document.getElementById("contact_button");
  const btnClose = document.getElementById("contact_close");
  const btnSubmit = document.getElementById("contact_submit");
  const modal = document.getElementById("contact_modal");
  const main = document.getElementById("main");
  const firstNameInput = document.getElementById("contact_firstName");
  const lastNameInput = document.getElementById("contact_lastName");
  const emailInput = document.getElementById("contact_email");
  const messageInput = document.getElementById("contact_message");
  const photographerName = document.getElementById("photographer-name-contact");

  modalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    main.setAttribute("aria-hidden", "true");
    firstNameInput.focus();
  });

  btnClose.addEventListener("click", () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    main.setAttribute("aria-hidden", "false");
  });

  photographerName.innerHTML = name;

  btnSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    let isFormValid = true;

    const data = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      message: messageInput.value,
    };
    if (!isValidInput(firstNameInput)) {
      isFormValid = false;
    }
    if (!isValidInput(lastNameInput)) {
      isFormValid = false;
    }
    if (!isValidEmail(emailInput)) {
      isFormValid = false;
    }
    if (!isValidInput(messageInput)) {
      isFormValid = false;
    }

    if (isFormValid) {
      console.log(data);
      modal.style.display = "none";
    }
  });

  function isValidInput(input) {
    if (input.value !== "") {
      const errorMessage = document.getElementById(`error-message-${input.id}`);
      if (errorMessage) {
        errorMessage.remove();
      }
      input.style.border = "none";
      return true;
    } else {
      if (document.getElementById(`error-message-${input.id}`) == null) {
        const errorMessage = document.createElement("p");
        errorMessage.setAttribute("id", `error-message-${input.id}`);
        errorMessage.style.color = "red";
        errorMessage.innerHTML = "Veuillez remplir ce champ";
        input.insertAdjacentElement("afterend", errorMessage);
      }
      input.style.border = "5px solid red";

      return false;
    }
  }
  function isValidEmail(emailInput) {
    if (
      emailInput != null &&
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailInput.value)
    ) {
      const errorMessage = document.getElementById(`error-message-email`);
      if (errorMessage) {
        errorMessage.remove();
      }
      emailInput.style.border = "none";
      return true;
    } else {
      if (document.getElementById(`error-message-email`) == null) {
        const errorMessage = document.createElement("p");
        errorMessage.setAttribute("id", `error-message-email`);
        errorMessage.style.color = "red";
        errorMessage.innerHTML = "Veuillez entrer une adresse email valide";
        emailInput.insertAdjacentElement("afterend", errorMessage);
      }
      emailInput.style.border = "5px solid red";
      return false;
    }
  }
}

async function displayDropdown(dropdownOptions) {
  const dropdownSection = document.getElementById("dropdown-section");

  const dropdownDOM = document.createElement("select");
  dropdownDOM.setAttribute("id", "dropdown");
  const dropdownLabelDOM = document.createElement("label");
  dropdownLabelDOM.setAttribute("for", "dropdown");
  dropdownLabelDOM.innerHTML = "Trier par";

  dropdownOptions.forEach((option) => {
    dropdownDOM.innerHTML =
      dropdownDOM.innerHTML + `<option value="${option}">${option}</option>`;
  });

  dropdownSection.appendChild(dropdownLabelDOM);
  dropdownSection.appendChild(dropdownDOM);

  dropdownDOM.addEventListener("change", async () => {
    handleSorting(dropdownDOM);
  });
}

async function handleSorting(dropdownDOM) {
  if (dropdownDOM.value == "Popularité") {
    mediaList.sort((a, b) => b.likes - a.likes);
  } else if (dropdownDOM.value == "Date") {
    mediaList.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (dropdownDOM.value == "Titre") {
    mediaList.sort((a, b) => a.title.localeCompare(b.title));
  }
  displayMiniatures(mediaList);
}

function mediaFactory(media) {
  if (media.image) {
    return new Image(media);
  } else if (media.video) {
    return new Video(media);
  }
}

function displayMiniatures(medias) {
  const mediaSection = document.getElementById("photograph-miniatures");
  mediaSection.innerHTML = "";
  medias.forEach((media) => {
    let newMedia = mediaFactory(media);
    mediaSection.appendChild(newMedia.display());
    newMedia.handleLikes();
  });
}

export async function getTotalLikes() {
  let totalLikes = 0;
  mediaList.forEach((media) => {
    totalLikes += media.likes;
  });
  return totalLikes;
}

export async function updateTotalLikesDOM() {
  const totalLikesDOM = document.getElementById("total-likes-number");
  const totalLikes = await getTotalLikes();
  totalLikesDOM.innerHTML = totalLikes;
}

async function displayStickyInfos(photographer) {
  const footer = document.querySelector("footer");
  const totalLikes = await getTotalLikes();

  footer.innerHTML = `
        <span class="total-likes">
            <p id="total-likes-number">${totalLikes}</p>
            <em class="fas fa-heart" aria-label="nombre de likes"></em>
        </span>
        <span class="price">
            ${photographer.price}€/jour
        </span>
    `;
}

async function handleMediaModalButtons(mediaList) {
  const modal = document.getElementById("media_modal");
  const modalContent = document.getElementById("middle_part");
  const modalClose = document.getElementById("close_button");
  const modalNext = document.getElementById("next_button");
  const modalPrev = document.getElementById("prev_button");
  const main = document.querySelector("main");
  window.onkeydown = handleKeyboardNavigation;

  modalClose.addEventListener("click", () => {
    handleCloseModal();
  });

  function handleKeyboardNavigation(e) {
    if (e.keyCode === 39) {
      handleNavigation(true);
    } else if (e.keyCode === 37) {
      handleNavigation(false);
    } else if (e.keyCode === 27) {
      handleCloseModal();
    }
  }

  modalNext.addEventListener("click", () => {
    handleNavigation(true);
  });

  modalPrev.addEventListener("click", () => {
    handleNavigation(false);
  });

  async function handleNavigation(increment) {
    const currentMediaId = modalContent.firstChild.getAttribute("id");
    const currentMediaIndex = mediaList.findIndex(
      (media) => media.id == currentMediaId
    );
    let nextMedia = mediaList[0];

    if (increment) {
      nextMedia =
        currentMediaIndex == mediaList.length - 1
          ? mediaList[0]
          : mediaList[currentMediaIndex + 1];
    } else {
      nextMedia =
        currentMediaIndex == 0
          ? mediaList[mediaList.length - 1]
          : mediaList[currentMediaIndex - 1];
    }

    if (nextMedia.image) {
      modalContent.innerHTML = `<img src="./../../assets/images/${nextMedia.image}" alt="${nextMedia.title}" id="${nextMedia.id}"/>
            <div class="media-title">${nextMedia.title}</div>
            `;
    } else if (nextMedia.video) {
      modalContent.innerHTML = `<video controls id="${nextMedia.id}">
            <source src="/../../assets/videos/${nextMedia.video}" type="video/mp4" alt="${nextMedia.title}"></source>
            </video>
            <div class="media-title">${nextMedia.title}</div>`;
    }
  }

  function handleCloseModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    main.setAttribute("aria-hidden", "false");
  }
}

async function init() {
  console.log("init");
  const photographerData = await getPhotographerData();
  const photographer = new Photographer(photographerData);

  const medias = await getMedias();
  initMediaList(medias);
  displayHeader(photographer);
  displayDropdown(["Popularité", "Date", "Titre"]);
  displayMiniatures(mediaList);
  displayStickyInfos(photographer);
  handleMediaModalButtons(mediaList);
}

async function initMediaList(medias) {
  medias.forEach((media) => {
    if (media.image) {
      const image = new Image(media);
      mediaList.push(image.media);
    } else if (media.video) {
      const video = new Video(media);
      mediaList.push(video.media);
    }
  });
}

if (document.location.pathname === "/photographer.html") {
  console.log("hello ??");
  init();
}
