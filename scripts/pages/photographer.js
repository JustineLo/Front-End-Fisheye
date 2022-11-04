let params = (new URL(document.location)).searchParams;
let id = params.get('id');

async function getPhotographer() {
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

async function displayHeader(nameDOM, locationDOM, taglineDOM, pictureDOM) {
    const photographerInfos = document.querySelector("#photographer-infos");
    const photographerPicture = document.querySelector("#photographer-picture");
    photographerInfos.appendChild(nameDOM)
    photographerInfos.appendChild(locationDOM)
    photographerInfos.appendChild(taglineDOM)
    photographerPicture.appendChild(pictureDOM)
}

async function displayMiniatures(medias) {
    const mediaSection = document.getElementById("photograph-miniatures");
    console.log(medias)
    medias.forEach(async (media) => {
        const mediaDOM = await displaySingleMedia(media)
        mediaSection.appendChild(mediaDOM)
    })
}

async function displaySingleMedia(media) {
    if (media.image) {
        const picture = `../../assets/images/${media.image}`;
        const pictureDOM = document.createElement('img');
        pictureDOM.setAttribute("src", picture)
        return pictureDOM
    } else if (media.video) {
        const video = `../../assets/videos/${media.video}`;
        const videoDOM = document.createElement('source');
        videoDOM.setAttribute("src", video)
        videoDOM.setAttribute("type", "video/mp4")
        return videoDOM
    }
}



async function init() {
    const photographer = await getPhotographer()
    const myPhotographe = photographerFactory(photographer)
    const nameDOM = myPhotographe.displayUserName()
    const locationDOM = myPhotographe.displayUserLocation()
    const taglineDOM = myPhotographe.displayUserTagline()
    const pictureDOM = myPhotographe.displayUserPicture()

    const medias = await getMedias()

    displayHeader(nameDOM, locationDOM, taglineDOM, pictureDOM)
    displayMiniatures(medias)
}

init()