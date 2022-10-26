async function getPhotographers() {
    // Penser à remplacer par les données récupérées dans le json
    let response = await fetch('/data/photographers.json')
        .then((response) => response.json())
        .then((response) => response.photographers)
        .catch((err) => console.log('an error', err))
    // et bien retourner le tableau photographers seulement une fois
    return response
}



async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerFactory(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
};

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();

    displayData(photographers);
};

init();
