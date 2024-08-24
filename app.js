console.log("Hello");

// --------- Variables ---------

let images = [
  {
    src: "./assets/landscape-540p.webp",
    alt: "wide angle landscape",
    srcset: `./assets/landscape-540p.webp 960w,
./assets/landscape-720p.webp 1280w,
./assets/landscape-1080p.webp 1920w,
./assets/landscape-1440p.webp 2560w `,
  },
  {
    src: "./assets/mountain-540p.webp",
    alt: "mountain view",
    srcset: `./assets/mountain-540p.webp 960w,
./assets/mountain-720p.webp 1280w,
./assets/mountain-1080p.webp 1920w,
./assets/mountain-1440p.webp 2560w `,
  },
  {
    src: "./assets/nature-540p.webp",
    alt: "nature view",
    srcset: `./assets/nature-540p.webp 960w,
./assets/nature-720p.webp 1280w,
./assets/nature-1080p.webp 1920w,
./assets/nature-1440p.webp 2560w `,
  },
  {
    src: "./assets/russia-540p.webp",
    alt: "russia nature",
    srcset: `./assets/russia-540p.webp 960w,
./assets/russia-720p.webp 1280w,
./assets/russia-1080p.webp 1920w,
./assets/russia-1440p.webp 2560w `,
  },
  {
    src: "./assets/sunset-540p.webp",
    alt: "sunset above pyramids",
    srcset: `./assets/sunset-540p.webp 960w,
./assets/sunset-720p.webp 1280w,
./assets/sunset-1080p.webp 1920w,
./assets/sunset-1440p.webp 2560w `,
  },
  {
    src: "./assets/trees-540p.webp",
    alt: "forest view",
    srcset: `./assets/trees-540p.webp 960w,
./assets/trees-720p.webp 1280w,
./assets/trees-1080p.webp 1920w,
./assets/trees-1440p.webp 2560w `,
  },
  {
    src: "./assets/waterfalls-540p.webp",
    alt: "waterfall view",
    srcset: `./assets/waterfalls-540p.webp 960w,
./assets/waterfalls-720p.webp 1280w,
./assets/waterfalls-1080p.webp 1920w,
./assets/waterfalls-1440p.webp 2560w `,
  },
];

const thumbnailContainer = document.getElementById("thumbnailContainer");
const displayContainer = document.getElementById("displayContainer");
let imageIndex = 0;

// ------- Background --------

function updateBackground() {
  const currentImage = images[imageIndex];
  const srcsetArray = currentImage.srcset.split(",").map((src) => src.trim());

  // Map resolutions to dppx values in reverse order
  const imageSet = srcsetArray
    .map((src) => {
      const [url, width] = src.split(" ");
      const dppx = 5 - parseInt(width) / 960; // might need tweaking
      return `url('${url}') ${dppx}x`;
    })
    .join(", ");
  // Apply to background image using image-set
  document.body.style.backgroundImage = `url('${images[imageIndex].src}')`; // For older browsers
  document.body.style.backgroundImage = `-webkit-image-set(${imageSet})`;
  document.body.style.backgroundImage = `image-set(${imageSet})`;
  // logging to see why its backwards
  console.log(imageSet); //console.log(document.body.style.backgroundImage);
}

// ------- Thumbnail ----------

function createThumbnails() {
  images.forEach(function (image, index) {
    const imageElement = document.createElement("img"); //create <img></img>
    imageElement.src = image.src;
    imageElement.alt = image.alt;
    imageElement.setAttribute("tabindex", 0);
    thumbnailContainer.appendChild(imageElement);

    imageElement.addEventListener("click", function () {
      console.log(`clicked ${image.alt}`);
      imageIndex = index;
      updateBackground();
    });
  });
  updateBackground(); // load initial background
}

// --------- Buttons ----------

function createButtons() {
  const leftButton = document.createElement("button");
  const rightButton = document.createElement("button");

  leftButton.textContent = " < ";
  rightButton.textContent = " > ";

  leftButton.id = "#leftButton";
  rightButton.id = "#rightButton";

  leftButton.setAttribute("aria-label", "Previous image");
  rightButton.setAttribute("aria-label", "Next image");

  document.body.appendChild(leftButton);
  document.body.appendChild(rightButton);

  //update background with either button
  leftButton.addEventListener("click", function () {
    console.log(`Clicked left button`);
    imageIndex = (imageIndex - 1 + images.length) % images.length;
    updateBackground();
  });

  rightButton.addEventListener("click", function () {
    console.log(`Clicked right button`);
    imageIndex = (imageIndex + 1) % images.length;
    updateBackground();
  });
}
// -------- Key Press Listeners --------

document.addEventListener("keydown", function (event) {
  const thumbnails = document.querySelectorAll("img[tabindex='0']");
  const focusedElement = document.activeElement;
  const firstThumbnail = thumbnails[0];
  const lastThumbnail = thumbnails[thumbnails.length - 1];

  if (event.keyCode === 9) {
    // Tab key pressed
    console.log("Tab key pressed");

    let currentIndex = Array.prototype.indexOf.call(thumbnails, focusedElement);

    if (event.shiftKey) {
      // shift + tab (backwards nav)
      if (focusedElement === firstThumbnail) {
        event.preventDefault(); // interupt default tab behaviour
        lastThumbnail.focus(); // Loop back to last thumbnail
        imageIndex = thumbnails.length - 1;
      } else {
        event.preventDefault();
        const previousIndex =
          currentIndex - 1 >= 0 ? currentIndex - 1 : thumbnails.length - 1;
        thumbnails[previousIndex].focus();
        imageIndex = previousIndex;
      }
    } else {
      // tab (forward nav)
      if (focusedElement === lastThumbnail) {
        event.preventDefault();
        firstThumbnail.focus(); // Loop back to first thumbnail
        imageIndex = 0;
      } else {
        event.preventDefault();
        const nextIndex =
          currentIndex + 1 < thumbnails.length ? currentIndex + 1 : 0;
        thumbnails[nextIndex].focus();
        imageIndex = nextIndex;
      }
    }
  } else if (event.keyCode === 13) {
    // Enter key pressed
    console.log(`Enter keyboard key pressed on ${focusedElement.alt}`);
    updateBackground();
  } else if (event.keyCode === 37) {
    // Left arrow key pressed
    console.log("Left keyboard arrow pressed");
    imageIndex = (imageIndex - 1 + images.length) % images.length;
    thumbnails[imageIndex].focus();
    updateBackground();
  } else if (event.keyCode === 39) {
    // Right arrow key pressed
    console.log("Right keyboard arrow pressed");
    imageIndex = (imageIndex + 1) % images.length;
    thumbnails[imageIndex].focus();
    updateBackground();
  }
});

// ------- Window Resize Listeners ---------
window.addEventListener("load", updateBackground);
window.addEventListener("resize", updateBackground);

// ------- Calling the Functions ----------

createThumbnails();
createButtons();
