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

    modalBtn.addEventListener("click", () => {
        const modal = document.getElementById("contact_modal");
        console.log(modal);
        modal.style.display = "block";
    })

    btnClose.addEventListener("click", () => {
        const modal = document.getElementById("contact_modal");
        modal.style.display = "none";
    })


    btnSubmit.addEventListener("click", (event) => {
        event.preventDefault();
        const data = {
            firstName: document.getElementById("contact_firstName").value,
            lastName: document.getElementById("contact_lastName").value,
            email: document.getElementById("contact_email").value,
            message: document.getElementById("contact_message").value
        }
        console.log(data)

    })
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


function initMediaModal() {
    const modalBtn = document.getElementById("");
    const btnClose = document.getElementById("contact_close");
    const btnSubmit = document.getElementById("contact_submit");

    modalBtn.addEventListener("click", () => {
        const modal = document.getElementById("contact_modal");
        console.log(modal);
        modal.style.display = "block";
    })

    btnClose.addEventListener("click", () => {
        const modal = document.getElementById("contact_modal");
        modal.style.display = "none";
    })


    btnSubmit.addEventListener("click", (event) => {
        event.preventDefault();
        const data = {
            firstName: document.getElementById("contact_firstName").value,
            lastName: document.getElementById("contact_lastName").value,
            email: document.getElementById("contact_email").value,
            message: document.getElementById("contact_message").value
        }
        console.log(data)

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

async function init() {
    const photographerData = await getPhotographerData()
    const photographer = new Photographer(photographerData)

    const medias = await getMedias();
    initMediaList(medias);

    displayHeader(photographer);
    displayDropdown(["Popularité", "Date", "Titre"]);
    displayMiniatures(mediaList);
    displayStickyInfos(photographer);
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
initMediaModal()
