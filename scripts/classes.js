export class Photographer {
    constructor(data) {
        this.name = data.name;
        this.portrait = data.portrait;
        this.city = data.city;
        this.country = data.country;
        this.tagline = data.tagline;
        this.price = data.price;
        this.tags = data.tags;
        this.id = data.id;
    }

    getUserPictureDOM() {
        return `<img src="../../assets/photographers/${this.portrait}" class="avatar" alt="${this.portrait}" />`;
    }

    getUserNameDOM() {
        return `<h2>${this.name}</h2>`;
    }

    getUserLocationDOM() {
        return `<p>${this.city}, ${this.country}</p>`;
    }

    getUserTaglineDOM() {
        return `<p>${this.tagline}</p>`;
    }

    getUserPriceDOM() {
        return `<p>${this.price}€/jour</p>`;
    }

    getUserCardDOM() {
        return `<article>
            <a href="./photographer.html?id=${this.id}">
                ${this.getUserPictureDOM()}
                ${this.getUserNameDOM()}
                <div class="photographer-card-infos">
                    ${this.getUserLocationDOM()}
                    ${this.getUserTaglineDOM()}
                    ${this.getUserPriceDOM()}
                </div>
            </a>
        </article>`
    }
}

export class Image {
    constructor(media) {
        this.media = media;
    }

    displayImage() {
        const pictureCard = document.createElement('div');
        pictureCard.setAttribute("class", "media-card");
        pictureCard.innerHTML = `
            <img src="/../../assets/images/${this.media.image}" alt="${this.media.title}" />
            <div class="picture-infos">
                <h3>${this.media.title}</h3>
                <p class="picture-likes">${this.media.likes} <i class="fas fa-heart"></i></p>
            </div>
        `
        return pictureCard
    }

}

export class Video {
    constructor(media) {
        this.media = media;
    }

    displayVideo() {
        const videoCard = document.createElement('div');
        videoCard.setAttribute("class", "media-card");
        videoCard.innerHTML = `
            <video src="/../../assets/videos/${this.media.video}" type="video/mp4" alt="${this.media.title}" />
            <div class="picture-infos">
                <h3>${this.media.title}</h3>
                <p class="picture-likes">${this.media.likes} <i class="fas fa-heart"></i></p>
            </div>
        `
        return videoCard
    }

}