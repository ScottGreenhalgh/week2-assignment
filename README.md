# week2-assignment

## Build an Accessible Image Gallery

### Production Process

#### Initial Setup

To start the project I initially wanted to gather the resources needed to fill out the page. To begin this process I visited https://wallup.net/. This website has a vast array of images along with differnent resizing options avaliable, preventing me from wasting time sourcing a method of resizing all the images that I needed. To ensure that the most popular desktop aspect ratio was covered, I opted exclusively for 16:9 aspec ratio images. I chose 540p, 720p, 1080p and 1440p as my desired resolutions and gathered all four of these for each image. Each image was initially in the .jpg file format and therefore I quickly converted all of them to .webp. Next was the favicon. For this selection, I chose a random image to simply act as a placeholder. For this segment I grabed an already relatively small image and dumped it into https://favicon.io/favicon-converter/ where it output numerous files usable on all possible devices. I added this to the HTML element and pathed it accordingly.

#### Creating the styling

With all the images out of the way I initially put together a layout with just html and css, without javascript. To do this I created a body a div and a few placeholders for images. I placed a single background image directly onto the body to work as my baseline for styling. Then I attached every instance of my 540p images under the div as image elements. I assigned id=thumbnailContainer to the div and applied styling to the img, body and that ID. During this styling process I looked up various resources through MDN and web3 to find the exact attributes I needed to grab and apply for my desired styling. This was where I came across the scrollbar. I decided to shrink the overall size of my container element, enabled a scroll bar for better usability. This also allowed me to better format this later when handling mobile formats, which was my next task. I added the @media accessibility segment which reduced the size of the container and moved it to the lower half of the screen. I also added some accesibility settings which seemed incredibly useful from this source: https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/

#### Preparing the JavaScript

Once the styling resembled roughly what I was looking for I looked to tackle the javascript, the segment which I knew was the meat of this project. With a plan in mind of exactly what I wanted it to look like, I saved a copy of the HTML element elsewhere and removed it all. From here I took a look at the reference material avaliable on the TechEd GitHub and acknowleged the need for a large array to begin the task. I created an identical array with src: and alt: elements however to prepare for screen size readjustments needed later down the line, I opted to also include my srcset: element at this time too. This took a good while to include all 7 images along with their 4 different resolutions, correctly pathed to the assets folder. Using the TechEd GitHub as a reference again, I saw a function that created the thumbnail element which was extremely useful as a starting block. From here I created two additional functions, which I begain experimenting with. These never made the final cut but I will include them here to show my thought process:

`   function createMainDisplay(imageParam) {`
`        displayContainer.innerHTML = "";`
`        const displayImageElement = document.createElement("img");`
`        displayImageElement.src = imageParam.src;`
`        displayImageElement.alt = imageParam.alt;`
`        displayContainer.appendChild(displayImageElement);`
`   }`
`
` function createBackgroundImage(imageParam) {`
` document.body.style.backgroundImage = "";`
` document.body.style.backgroundImage = "url('" + imageParam.src + "')";`
` } `

After playing around with these functions for a little while, I quickly realised that if I needed to refer to the array index in future, this would need to be a local variable. Therfore I defined `let imageIndex = 0;` This allowed me to also set a default image to the gallery prior to user selection, which would take the src of position 0 in the array. From here I developed a new background image function, under a different name since I still had the other at this time. This also didn't make the cut later, so I will also include this here:

`   function updateBackground() {`
`       document.body.style.backgroundImage = "url('${images[imageIndex].src}");`
`   }`

#### Tab handler

At this point, everything was working as intended, so my attention deviated slightly. I wanted buttons to navigate left and right. I had no button styling at this point, so it was back to the css to create a rough idea of what I wanted them to look like. After some tinkering around I added some transparency to the button elements and added some text to act as a placeholder. I ran into an issue here where creating the css for the buttons wasn't applying. It was a huge headscratcher but I managed to find a workaround by adding `button/` as a prefix. Once this looked good, I once again deleted any HTML elements I created to complete the styling and went back over to the javascript. I then created the elements and accompanying click event listenders for each button.

After this I focused on the tab navigation, where I quickly noticed that pressing tab too many times selected the buttons, and then different elements of the browser itself. To prevent this I looked up the method used to interupt default behvaiour and create my own desired outcome. This was `event.preventDefault();`. From here I had two main problems, I needed to handle. The first was which index I was at when tabbing, and the second was what happens when I reached either end of the index (seeing as Shift + Tab would cycle through in the opposite direction). To overcome this problem I create four new variables:

`   const thumbnails = document.querySelectorAll("img[tabindex='0']");`
`   const focusedElement = document.activeElement;`
`   const firstThumbnail = thumbnails[0];`
`   const lastThumbnail = thumbnails[thumbnails.length - 1];`

With these I had all the information at my disposal and just needed to do some math to ensure everything was tracking the correct index when it needed to be. Using the function `.focus();` I was able to force the loop back to either end when we ventured outside the dataset range.

#### Additional buttons

To ensure it was indeed tracking correctly I added tracking for the Enter key. I looked up the keyCode on https://www.toptal.com/developers/keycode/table which for this button was 13, meanwhile I previously used 9 for tab. I added a console log for the selected element using the previosly made `focusedElement` variable. This told me exactly where I was. Some slight adjustments were made to the math here but for the most part it worked as intended.

Next came the arrow keys, not only did I want buttons on the page to change the image, but I also wanted input compatibility with the keyboard to do exactly this (outside of the already implamented tab functionality). These were both added using an almost ideatical method as previosuly, using a keyDown event listener, all while ensuring the index was what it needed to be.

#### Image srcSet

After getting heavily sidetracked on buttons for a good long while, I decided to refocus on more important tasks. This was to create the window load and resize listeners. This was when I realised my earlier blunder. Only img tags can take the srcSet element, whereas I implamented the image directly to the body using background-image. What I initially thought would be an easy task of simply adding the srcset to the img turned into a quite the issue. After debating a rewrite, I found that using `background-image: image-set()` could do an identical job, so I opted to explore this avenue instead. We were already this far through the project, that I decided rewriting to accomodate this was not an option. This did however mean that my updateBackground function would no longer be usable and this portion needed a rewrite instead.

`document.body.style.backgroundImage = "-webkit-image-set(${srcset})";`

Adding the above component into the mix seemed to handle what I needed, but due to the formatting of my array, some additional changes were needed. I used both `.trim()` and `.split()` to grab only the relevant parts that I needed. While at this point I could've just removed redundant information from the object, I wanted to keep it in the off chance this didn't work exactly the way I intended. Which happened to be exactly what happened. To begin with I attempted to complete this task using the following:

`    function updateBackground() {`
`        const currentImage = images[imageIndex];`
`        const srcset = currentImage.srcset`
`            .split(",")`
`            .map((src) => {`
`        const [url, resolution] = src.trim().split(" ");`
`        return "url('${url}') ${resolution}";`
`        })`
`    .join(", ");`
`    document.body.style.backgroundImage = "-webkit-image-set(${srcset})";`
`    document.body.style.backgroundImage = "image-set(${srcset})";`

Using the following page as a source: https://dev.to/ingosteinke/responsive-background-images-with-image-set-the-srcset-for-background-image-259a I noticed that the format I was supplying didn't match what was needed the segment handling the resolution wasn't needed here. Instead parameters such as x1 x2 etc. were needed instead. While the conversion of 540p to 144p isn't exactly correct to x4, after some testing it appeared to output a strong result, the images were cycling on zoom.

#### Bugs

Immediately after this I ran into yet another bug with my implamentation. Initially I thought I managed to loop through the the dataset backwards and assign the highest resolution images the wrong scaling. I could see the highest quality image was loading on the devices that didn't need it, and the lower quality images were loading on the screens that could see the difference. I added some logs to see where I was going wrong, turns out my understanding of this element is quite minimal, the documentation surrounding `image-set()`indicates that 1x should be the lowest resolution and 4x to be the highest, however after reversing this, the images loaded in the correct order.

After earlier eye observations told me it was backwards, I assumed reverse mapping. I'm unsure if my specific implementation of this element is unconventional, my understanding is completely wrong, or if the documentation is backwards. Either way, it works now so I'm not going to touch it further.

#### AIDA

Finally I reached the final critical item that needed implamenting, the ARIA elements. Firstly I applied `aria-live="polite"` directly to the div in the HTML element that houses the thumnnails. From here I wanted to apply aria-label to the buttons directly. To do this I removed redundancy such as `leftButton.setAttribute("id", "#leftButton");`, replaced this with `leftButton.id = "leftButton"` allowing me to use the now empty `.setAttribute("aria-label, "Previous image")`. I did the same with the other button. Changing this at the very end made me realise why my css elements were behaving strangely when styling the buttons. The hashtag doesn't need to be part of the string when setting the id in javascript. I opted to keep the hashtag as a learning experience of what not to do in future.

### Conclusion

To summaries the page. Media queries are present. The alt element is present on all images. I included an srcset (despite not using it as initially intended). I've included ARIA elements such as aria-label and aria-live. Keyboard shortcuts such as left arrow, right arrow, enter, shift+tab and tab are all present. The scaling works on multiple devices and elements change with @media. I believe I've at least attempted all of the goals for this project.

That being said, it's hard for me to say if the image loading based off screen resolution is working perfectly even now. The math I used might be a little off given I tried 5 different methods of trying to achieve this. It does change which image is loaded depending on zoom, and when locked to mobile aspect ratio it doesn't load the largest image, which is a good sign. I'm just not entirely sure it does it at the correct increments. This is something the end user might never notice, although I would prefer if it would work as I intended. This was by far the most difficult part of the project.

As for what went really well, the I think the styling looks perfect, it's exactly how I imagined it to look. There may be a slight gap where the scroll bar sits if you really zoom into the thumbnail container but besides that the styling looks great. All of the buttons work seemlessly too and perfectly sync with each other thanks to my decision to store the index as a local variable.

With a little more work on the dynamically loading images, I probably could perfect it by forcing my window to very specific resolutions, however for the purpose of this project (and after the amount of time spent on that segment) I opted not to. Overall I believe this turned out perfect.
