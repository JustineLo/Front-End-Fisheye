async function getPhotographers() {
    const response = await fetch('/data/photographers.json')
        .then((response) => response.json())
        .then((data) => data.photographers)
        .catch((err) => console.log('an error', err))

    return response
}


async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerFactory(photographer)
        const userCardDOM = photographerModel.displayUserCardDOM()
        photographersSection.appendChild(userCardDOM)
    })

}

async function init() {
    // Récupère les datas des photographes
    const photographers = await getPhotographers()
    displayData(photographers)
}

init()

