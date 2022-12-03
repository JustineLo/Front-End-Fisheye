import { updateTotalLikesDOM } from "./photographer.js";

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
            <button class="media-button">
                <img src="/../../assets/images/${this.media.image}" alt="${this.media.title}" />
            </button>
            <div class="picture-infos">
                <h3>${this.media.title}</h3>
                <p class="picture-likes">
                    <span id="likes-number-${this.media.id}">${this.media.likes}</span>
                    <i id="heart-icon-${this.media.id}" class="fas fa-heart"></i>
                </p>
            </div>
        `
        return pictureCard
    }

    handleLikes() {
        const clickHeart = document.getElementById(`heart-icon-${this.media.id}`);
        clickHeart.addEventListener("click", async () => {
            this.media.likes++
            document.getElementById(`likes-number-${this.media.id}`).innerHTML = this.media.likes;
            updateTotalLikesDOM();
        })
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
            <button class="media-button">
                <video src="/../../assets/videos/${this.media.video}" type="video/mp4" alt="${this.media.title}"></video>
            </button>
            <div class="picture-infos">
                <h3>${this.media.title}</h3>
                <p class="picture-likes">
                    <span id="likes-number-${this.media.id}">${this.media.likes}</span>
                    <i id="heart-icon-${this.media.id}" class="fas fa-heart"></i>
                </p>
            </div>
        `
        return videoCard
    }

    handleLikes() {
        const clickHeart = document.getElementById(`heart-icon-${this.media.id}`);

        clickHeart.addEventListener("click", async () => {
            this.media.likes++
            document.getElementById(`likes-number-${this.media.id}`).innerHTML = this.media.likes;
            updateTotalLikesDOM();
        })
    }

}