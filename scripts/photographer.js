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
        <button class="contact_button">Contactez-moi</button>
        ${photographer.getUserPictureDOM()}
    `
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
}

async function handleSorting() {
    const dropdown = document.getElementById("dropdown");
    const mediaSection = document.getElementById("photograph-miniatures");

    dropdown.addEventListener("change", async () => {
        const medias = await getMedias();
        mediaSection.innerHTML = "";
        console.log("changed");

        if (dropdown.value == "Popularité") {
            medias.sort((a, b) => b.likes - a.likes)
        } else if (dropdown.value == "Date") {
            medias.sort((a, b) => new Date(b.date) - new Date(a.date))
        } else if (dropdown.value == "Titre") {
            medias.sort((a, b) => a.title.localeCompare(b.title))
        }

        displayMiniatures(medias);
    })
}

async function displayMiniatures(medias) {
    const mediaSection = document.getElementById("photograph-miniatures");
    medias.forEach(async (media) => {
        if (media.image) {
            const image = new Image(media);
            mediaList.push(image.media)
            mediaSection.appendChild(image.displayImage())
            image.handleLikes()
        } else if (media.video) {
            const video = new Video(media);
            mediaList.push(video.media)
            mediaSection.appendChild(video.displayVideo())
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

async function init() {
    const photographerData = await getPhotographerData()
    const photographer = new Photographer(photographerData)

    const medias = await getMedias();

    displayHeader(photographer);
    displayDropdown(["Popularité", "Date", "Titre"]);
    displayMiniatures(medias);
    displayStickyInfos(photographer);
}

init()
