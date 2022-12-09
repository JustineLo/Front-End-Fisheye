import { Photographer, Image, Video } from './classes.js'

let params = (new URL(document.location)).searchParams;
let id = params.get('id');

export let mediaList = [];

async function getPhotographerData() {
    const response = await fetch('/data/photographers.json')
        .then((response) => response.json())
        .then((data) => data.photographers)
        .then((data) => data.find(photographer => photographer.id == id))
        .catch((err) => console.log('an error', err))
    return response
}

async function getMedias() {
    const response = await fetch('/data/photographers.json')
        .then((response) => response.json())
        .then((data) => data.media)
        .then((data) => data.filter(media => media.photographerId == id))
        .catch((err) => console.log('an error', err))
    return response
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
    `
    initContactModal();
}

function initContactModal() {
    const modalBtn = document.getElementById("contact_button");
    const btnClose = document.getElementById("contact_close");
    const btnSubmit = document.getElementById("contact_submit");
    const modal = document.getElementById("contact_modal");
    const main = document.getElementById("main");
    const firstNameInput =  document.getElementById("contact_firstName");
    const lastNameInput = document.getElementById("contact_lastName");
    const emailInput = document.getElementById("contact_email");
    const messageInput = document.getElementById("contact_message");

    modalBtn.addEventListener("click", () => {
        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false")
        main.setAttribute("aria-hidden", "true")
        firstNameInput.focus()
    })

    btnClose.addEventListener("click", () => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true")
        main.setAttribute("aria-hidden", "false")
    })


    btnSubmit.addEventListener("click", (event) => {
        event.preventDefault();
       
        const data = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            message: messageInput.value
        }
        if (isValidInput(firstNameInput) && isValidInput(lastNameInput) && isValidEmail(emailInput) && isValidInput(messageInput)) {
            console.log(data)
        }
    })

    function isValidInput(input) {
        if (input.value !== "") {
            input.style.border = "none"
            return true;
        } else {
            input.style.border = "5px solid red"
            return false;
        }
    }
    function isValidEmail(emailInput) {
        if (emailInput != null && (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/).test(emailInput.value)) {
          emailInput.style.border = "none"
          return true
        } else {
          emailInput.style.border = "5px solid red"
          return false
        }
      }
}

async function displayDropdown(dropdownOptions) {
    const dropdownSection = document.getElementById("dropdown-section");

    const dropdownDOM = document.createElement('select');
    dropdownDOM.setAttribute("id", "dropdown");
    const dropdownLabelDOM = document.createElement('label');
    dropdownLabelDOM.setAttribute("for", "dropdown");
    dropdownLabelDOM.innerHTML = "Trier par";

    dropdownOptions.forEach((option) => {   
        dropdownDOM.innerHTML = dropdownDOM.innerHTML + `<option value="${option}">${option}</option>`
    })

    dropdownSection.appendChild(dropdownLabelDOM)
    dropdownSection.appendChild(dropdownDOM)

    dropdownDOM.addEventListener("change", async () => {
        handleSorting(dropdownDOM)
    })

}

async function handleSorting(dropdownDOM) {

    if (dropdownDOM.value == "Popularité") {
        mediaList.sort((a, b) => b.likes - a.likes)
    } else if (dropdownDOM.value == "Date") {
        mediaList.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (dropdownDOM.value == "Titre") {
        mediaList.sort((a, b) => a.title.localeCompare(b.title))
    }
    displayMiniatures(mediaList);
}

async function displayMiniatures(medias) {
    const mediaSection = document.getElementById("photograph-miniatures");
    mediaSection.innerHTML = "";
    medias.forEach(async (media) => {
        if (media.image) {
            const image = new Image(media);
            mediaSection.appendChild(image.displayImage())
            image.handleLikes()
        } else if (media.video) {
            const video = new Video(media);
            mediaSection.appendChild(video.displayVideo())
            video.handleLikes()
        }
    })
}

export async function getTotalLikes() {
    let totalLikes = 0;
    mediaList.forEach((media) => {
        totalLikes += media.likes;
    })
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
            <i class="fas fa-heart"></i>
        </span>
        <span class="price">
            ${photographer.price}€/jour
        </span>
    `
}

async function handleMediaModalButtons(mediaList) {
    const modal = document.getElementById("media_modal");
    const modalContent = document.getElementById("middle_part");
    const modalClose = document.getElementById("close_button");
    const modalNext = document.getElementById("next_button");
    const modalPrev = document.getElementById("prev_button");
    const main = document.querySelector("main");

    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true")
        main.setAttribute("aria-hidden", "false")
    })


    modalNext.addEventListener("click", () => {
        handleNavigation(true)
    })

    modalPrev.addEventListener("click", () => {
        handleNavigation(false);
    })

    async function handleNavigation(increment) {
        const currentMediaId = modalContent.firstChild.getAttribute("id");
        const currentMediaIndex = mediaList.findIndex(media => media.id == currentMediaId);
        let nextMedia = mediaList[0]

        if (increment) {
            nextMedia = currentMediaIndex == mediaList.length - 1 ? mediaList[0] : mediaList[currentMediaIndex + 1];
        } else {
            nextMedia = currentMediaIndex == 0 ? mediaList[mediaList.length - 1] : mediaList[currentMediaIndex - 1];
        }
    
        if (nextMedia.image) {
            modalContent.innerHTML = `<img src="/../../assets/images/${nextMedia.image}" alt="${nextMedia.title}" id="${nextMedia.id}"/>
            <div class="media-title">${nextMedia.title}</div>
            `
        } else if (nextMedia.video) {
            modalContent.innerHTML = `<video controls id="${nextMedia.id}">
            <source src="/../../assets/videos/${nextMedia.video}" type="video/mp4" alt="${nextMedia.title}"></source>
            </video>
            <div class="media-title">${nextMedia.title}</div>`
        }
    }
}





async function init() {
    const photographerData = await getPhotographerData()
    const photographer = new Photographer(photographerData)

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
            mediaList.push(image.media)
        } else if (media.video) {
            const video = new Video(media);
            mediaList.push(video.media)
        }
    })
}

init()
