function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price } = data;

    function displayUserPicture() {
        const picture = `../../assets/photographers/${portrait}`;
        const img = document.createElement('img');
        img.setAttribute("src", picture)
        return img;
    }

    function displayUserName() {
        const nameElement = document.createElement('h2');
        nameElement.textContent = name;
        return nameElement;
    }

    function displayUserLocation() {
        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        return location;
    }

    function displayUserTagline() {
        const taglineElement = document.createElement('p');
        taglineElement.textContent = tagline;
        return taglineElement;
    }

    function displayUserPrice() {
        const priceElement = document.createElement('p');
        priceElement.textContent = `${price}€/jour`;
        return priceElement;
    }

    function displayUserCardDOM() {
        const a = document.createElement('a');
        a.href = `./photographer.html?id=${data.id}`;

        const article = document.createElement('article');
        const infosDiv = document.createElement('div');

        article.appendChild(a);
        a.appendChild(displayUserPicture());
        a.appendChild(displayUserName());
        a.appendChild(infosDiv);
        infosDiv.appendChild(displayUserLocation());
        infosDiv.appendChild(displayUserTagline());
        infosDiv.appendChild(displayUserPrice());

        return (article);
    }

    return { displayUserName, displayUserPicture, displayUserLocation, displayUserTagline, displayUserPrice, displayUserCardDOM }
}