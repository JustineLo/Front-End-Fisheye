import { Photographer } from "./classes.js";

async function getAllPhotographersData() {
  const response = await fetch("./data/photographers.json")
    .then((response) => response.json())
    .then((data) => data.photographers)
    .catch((err) => console.log("an error", err));

  return response;
}

function displayData(photographersData) {
  const photographersSection = document.getElementById("photographer-section");
  photographersData.forEach((photographerData) => {
    const photographer = new Photographer(photographerData);
    photographersSection.innerHTML =
      photographersSection.innerHTML + `${photographer.getUserCardDOM()}`;
  });
}

async function init() {
  const photographersData = await getAllPhotographersData();
  displayData(photographersData);
}

init();
