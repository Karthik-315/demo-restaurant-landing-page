/* Variables */
// DOM Elements

const menuButton = document.querySelector(".header__links-button");
const generalLinksContainer = document.querySelector(".links__general-container");

const sections = document.querySelectorAll(".section");
const allQualities = document.querySelectorAll(`.quality-container`);
const qualitiesContainer = document.querySelector(".article-qualities--content");

const slider = document.querySelector(".article-reviews--slider");
const reviewSlides = document.querySelectorAll(".reviews-slide-container");
const leftSlideButton = document.querySelector(".button--left");
const rightSlideButton = document.querySelector(".button--right");
const slideDots = document.querySelector(".reviews-slide-dots");

const creditsModal = document.querySelector(".credits__modal");
const bgBlur = document.querySelector(".blur-overlay");
const openModalButton = document.querySelector(".credits-modal-button");
const closeModalButton = document.querySelector(".close-modal-button");

// Other Variables
const menuActiveClass = `menu-active`;
let bgImageURL;
let imagePreGradient = `linear-gradient(to right, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),`;
let initialBgImage = `url("./images/qualities_interior.jpg")`;
let imageSlideShowInterval;
let reviewSlideShowInterval;
let reviewSlidePauseTimeout;
let imageCounter = 0;
// Switch to the second slide initially, by default, as the first slide will be displayed when the page is loaded.
let reviewCounter = 2;

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
// Use different image for mobile devices
// prettier-ignore
const imageList = 
    (vw >= 768)
        ?["qualities_food", "qualities_chef", "qualities_service", "qualities_produce", "qualities_bar", "qualities_interior"]
        :["qualities_food", "qualities_chef_responsive", "qualities_service", "qualities_produce", "qualities_bar", "qualities_interior"];

const numberOfSlides = reviewSlides.length;
let currentSlide = 1;
const enableModalClass = `enable-modal`;

// Functions

const setInitialBackground = function () {
    qualitiesContainer.style.backgroundImage = `${imagePreGradient}${initialBgImage}`;
};

const initializeObserver = function () {
    const options = {
        root: null, // viewport
        threshold: 0.1,
        rootMargin: "-50px",
    };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.toggle("active");
            observer.unobserve(entry.target);

            entry.target.classList.contains("section--reviews") &&
                slider.classList.toggle("active");
        });
    }, options);

    sections.forEach((section) => {
        observer.observe(section);
    });
};

const setBackground = function (targetImageIndex) {
    // Highlight current quality and set low opacity to the other qualities.
    allQualities.forEach((title) => (title.style.opacity = 0.4));
    allQualities[targetImageIndex].style.opacity = 1;

    qualitiesContainer.style.backgroundImage = `${imagePreGradient}url("${bgImageURL}")`;
};

const activateImageSlideshow = function () {
    // Clear previous intervals, if any.
    clearInterval(imageSlideShowInterval);

    imageSlideShowInterval = setInterval(() => {
        const currImage = imageList[imageCounter];
        bgImageURL = `./images/${currImage}.jpg`;
        setBackground(imageCounter);
        imageCounter >= 5 ? (imageCounter = 0) : imageCounter++;
    }, 2000);
};

const createDots = function () {
    // Sider dots
    reviewSlides.forEach((_, index) => {
        const slideDotHTML = `
		<button class="reviews-slide-dot" data-slide=${index + 1}></button>`;
        slideDots.insertAdjacentHTML("beforeend", slideDotHTML);
    });
};

const switchReviewSlides = function (targetSlide = 1) {
    reviewSlides.forEach((slide, index) => {
        const offset = index + 1;
        const allDots = document.querySelectorAll(".reviews-slide-dot");

        slide.style.transform = `translateX(${100 * (offset - targetSlide)}%)`;
        currentSlide = targetSlide;

        // Highlight relevant dot.
        allDots.forEach((dot) => {
            // Reset all dots
            dot.classList.remove("active-dot");
        });

        document
            .querySelector(`.reviews-slide-dot[data-slide="${targetSlide}"]`)
            .classList.add("active-dot");
    });
};

// Auto switch review slides over a set interval
const autoSwitchReviewSlides = function () {
    reviewSlideShowInterval = setInterval(function () {
        switchReviewSlides(reviewCounter);
        reviewCounter >= numberOfSlides ? (reviewCounter = 1) : reviewCounter++;
    }, 5000);
};

// Pause auto switching review slides, when user manually changes slides, and resume after set timeout
const pauseAutoSwitchSlides = function () {
    clearInterval(reviewSlideShowInterval);

    // Clear existing timeout, if any.
    clearTimeout(reviewSlidePauseTimeout);

    reviewSlidePauseTimeout = setTimeout(autoSwitchReviewSlides, 3000);
};

// Display credits (Images and other stuff)
const toggleCreditsModal = function () {
    creditsModal.classList.toggle(enableModalClass);
    bgBlur.classList.toggle("hidden");
};

// Personal links in footer
const setProfileLinks = function () {
    const coffeeURL = "https://buymeacoffee.com/skdev";
    const twitterURL = "https://twitter.com/skk_dev";
    const githubURL = "https://github.com/Karthik-315";
    const rickRollURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    const buyCoffeeLink = document.querySelector(".coffee-link");
    const twitterLink = document.querySelector(".twitter-link");
    const githubLink = document.querySelector(".github-link");
    const specialGift = document.querySelector(".surprise-link");

    buyCoffeeLink.href = coffeeURL;
    twitterLink.href = twitterURL;
    githubLink.href = githubURL;
    specialGift.href = rickRollURL;
};

// Initialize all tasks.
const initialize = function () {
    setInitialBackground();
    initializeObserver();
    activateImageSlideshow();
    createDots();
    switchReviewSlides();
    autoSwitchReviewSlides();
    setProfileLinks();
};

/*  Event listeners */

// Menu reveal listener for mobile devices
menuButton.addEventListener("click", function () {
    menuButton.classList.toggle(menuActiveClass);
    generalLinksContainer.classList.toggle(menuActiveClass);
});

// Switch images when you hover over qualities (Event delegation).
qualitiesContainer.addEventListener("mouseover", function (event) {
    const { quality } = event.target.dataset;

    if (quality) {
        clearInterval(imageSlideShowInterval);
        const targetImage = `qualities_${quality}`;
        bgImageURL = `./images/${targetImage}.jpg`;
        setBackground(imageList.indexOf(targetImage));

        event.target.addEventListener("mouseleave", activateImageSlideshow);
    }
});

// Right and Left slide navigation buttons
rightSlideButton.addEventListener("click", function () {
    currentSlide === numberOfSlides ? (currentSlide = 1) : currentSlide++;
    switchReviewSlides(currentSlide);
    pauseAutoSwitchSlides();
});

leftSlideButton.addEventListener("click", function () {
    currentSlide === 1 ? (currentSlide = numberOfSlides) : currentSlide--;
    switchReviewSlides(currentSlide);
    pauseAutoSwitchSlides();
});

// Listener for the slide dots
slideDots.addEventListener("click", function (event) {
    const { slide: targetSlide } = event.target.dataset;

    // If slide is "undefined", ignore
    targetSlide && switchReviewSlides(targetSlide);
    pauseAutoSwitchSlides();
});

// Open credits modal
openModalButton.addEventListener("click", toggleCreditsModal);

// Close modal on clicking the close button, clicking on the BG or, pressing the Escape key.
closeModalButton.addEventListener("click", toggleCreditsModal);

bgBlur.addEventListener("click", toggleCreditsModal);

document.addEventListener("keydown", function (event) {
    if (event.key === `Escape` && !creditsModal.classList.contains(`hidden`)) {
        toggleCreditsModal();
    }
});

// Starting point of the application.
initialize();
