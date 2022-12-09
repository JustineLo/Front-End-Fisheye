import { mediaList, updateTotalLikesDOM } from "./photographer.js";

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

        const pictureButton = document.createElement('button');
        pictureButton.setAttribute("class", "media-button");
        pictureButton.innerHTML = `<img src="/../../assets/images/${this.media.image}" alt="${this.media.title}" id="${this.media.id}" />`

        const pictureInfos = document.createElement('div');
        pictureInfos.setAttribute("class", "picture-infos");
        pictureInfos.innerHTML = `<h3>${this.media.title}</h3>
            <p class="picture-likes">
                <span id="likes-number-${this.media.id}">${this.media.likes}</span>
                <i id="heart-icon-${this.media.id}" class="fas fa-heart"></i>
            </p>
        `

        pictureCard.appendChild(pictureButton);
        pictureCard.appendChild(pictureInfos);

        pictureButton.addEventListener("click", (event) => {
            displayModalMedia(pictureButton.firstChild);
        })

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

        const videoButton = document.createElement('button');
        videoButton.setAttribute("class", "media-button");
        videoButton.innerHTML = `<video src="/../../assets/videos/${this.media.video}" type="video/mp4" alt="${this.media.title}" id="${this.media.id}"></video>`

        const videoInfos = document.createElement('div');
        videoInfos.setAttribute("class", "picture-infos");
        videoInfos.innerHTML = `<h3>${this.media.title}</h3>
            <p class="picture-likes">
                <span id="likes-number-${this.media.id}">${this.media.likes}</span>
                <i id="heart-icon-${this.media.id}" class="fas fa-heart"></i>
            </p>
        `

        videoCard.appendChild(videoButton);
        videoCard.appendChild(videoInfos);

        videoButton.addEventListener("click", () => {
            const modal = document.getElementById("media_modal");
            modal.style.display = "flex";
            const video = document.createElement('video');
            video.setAttribute("id", this.media.id);
            video.controls = true;
            video.innerHTML = `<source src="/../../assets/videos/${this.media.video}" type="video/mp4" alt="${this.media.title}" id="${this.media.id}"></source>`
            displayModalMedia(video);
        })

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

export async function displayModalMedia(mediaDOM) {
    const modal = document.getElementById("media_modal");
    const main = document.getElementById("main");
    modal.style.display = "flex";
    const middlePart = document.getElementById("middle_part");
    const currentMedia = mediaList.find(media => media.id == mediaDOM.getAttribute("id"));
    middlePart.innerHTML = mediaDOM.outerHTML + `<div class="media-title">${currentMedia.title}</div>`;
    modal.setAttribute("aria-hidden", "false")
    main.setAttribute("aria-hidden", "true")
}