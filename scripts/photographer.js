import { Photographer, Image, Video } from './classes.js'

let params = (new URL(document.location)).searchParams;
let id = params.get('id');

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

async function displayMiniatures(medias) {
    const mediaSection = document.getElementById("photograph-miniatures");
    medias.forEach(async (media) => {
        if (media.image) {
            const image = new Image(media);
            mediaSection.appendChild(image.displayImage())
        } else if (media.video) {
            const video = new Video(media);
            mediaSection.appendChild(video.displayVideo())
        }
    })
}

async function displayStickyInfos(photographer) {
    const footer = document.querySelector("footer");
    const medias = await getMedias();
    let totalLikes = 0;
    medias.forEach((media) => {
        totalLikes += media.likes;
    })


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
