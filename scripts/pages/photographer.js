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

async function getPictures() {
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

async function displayPictures(photographerName) {
    const pictures = await getPictures()
    const picturesSection = document.querySelector("#photograph-pictures");
    pictures.forEach((picture) => {
        const pictureDOM = displaySinglePicture(picture.image, photographerName)
        picturesSection.appendChild(pictureDOM)
    })
}

function displaySinglePicture(pictureName, photographerName) {
    const picture = `../../assets/images/${pictureName}`;
    console.log(pictureName)
    const pictureDOM = document.createElement('img');
    pictureDOM.setAttribute("src", picture)
    return pictureDOM;
}



async function init() {
    const photographer = await getPhotographer()
    const nameDOM = photographerFactory(photographer).displayUserName()
    const locationDOM = photographerFactory(photographer).displayUserLocation()
    const taglineDOM = photographerFactory(photographer).displayUserTagline()
    const pictureDOM = photographerFactory(photographer).displayUserPicture()

    const picture = await getPictures()

    displayHeader(nameDOM, locationDOM, taglineDOM, pictureDOM)
    displayPictures(photographer.name)
}

init()