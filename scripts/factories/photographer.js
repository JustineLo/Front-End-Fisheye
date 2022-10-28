function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price } = data;

    const picture = `../../assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');

        const img = document.createElement('img');
        img.setAttribute("src", picture)

        const h2 = document.createElement('h2');
        h2.textContent = name;

        const pDiv = document.createElement('div');

        const p1 = document.createElement('p');
        p1.textContent = `${city}, ${country}`;

        const p2 = document.createElement('p');
        p2.textContent = tagline;

        const p3 = document.createElement('p');
        p3.textContent = `${price}€/jour`;

        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(pDiv);
        pDiv.appendChild(p1);
        pDiv.appendChild(p2);
        pDiv.appendChild(p3);

        return (article);
    }


    return { name, picture, getUserCardDOM }
}