document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration & Data ---
    // Using placeholder image URLs. In a real app, these would be your actual image paths.
    const imageSources = [
        'assets/screenshots/1.png',
        'assets/screenshots/2.png',
        'assets/screenshots/3.png',
        'assets/screenshots/4.png',
        'assets/screenshots/5.png',
        'assets/screenshots/6.png',
        'assets/screenshots/7.png',
    ];

    let currentIndex = 0;

    // --- DOM Elements ---
    const mainImage = document.getElementById('main-image');
    const previewArea = document.getElementById('preview-area');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const fsToggleBtn = document.getElementById('fs-toggle-btn');
    const thumbnailContainer = document.getElementById('thumbnail-container');

    // SVG Icons for Fullscreen button
    const maximizeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
    const minimizeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minimize"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>';


    // --- Initialization ---
    // 1. Dynamically create thumbnails based on the image array
    imageSources.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.alt = `Thumbnail ${index + 1}`;
        thumb.classList.add('thumbnail');
        // Mark first one as active initially
        if (index === 0) thumb.classList.add('active');
        
        // Add click listener to thumbnail
        thumb.addEventListener('click', () => loadImageView(index));
        
        thumbnailContainer.appendChild(thumb);
    });

    const thumbnails = document.querySelectorAll('.thumbnail');

    // --- Core Functions ---

    /**
     * Loads the image at the specified index into the main view
     * and updates active thumbnail state.
     */
    function loadImageView(index) {
        // Boundary checks to enable wrap-around navigation
        if (index < 0) index = imageSources.length - 1;
        if (index >= imageSources.length) index = 0;

        currentIndex = index;

        // Optional: Fade effect
        mainImage.style.opacity = 0;
        setTimeout(() => {
             mainImage.src = imageSources[currentIndex];
             mainImage.style.opacity = 1;
        }, 200);
       

        // Update thumbnail active class
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[currentIndex].classList.add('active');
        
        // Ensure selected thumbnail is scrolled into view (helpful on mobile)
        thumbnails[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    /**
     * Toggles full screen mode on the preview area container.
     */
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            // Enter Fullscreen
            previewArea.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            // Exit Fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Update the full screen button icon based on state
    function updateFsButtonIcon() {
        if (document.fullscreenElement) {
            fsToggleBtn.innerHTML = minimizeIcon;
        } else {
            fsToggleBtn.innerHTML = maximizeIcon;
        }
    }


    // --- Event Listeners ---

    nextBtn.addEventListener('click', () => loadImageView(currentIndex + 1));
    prevBtn.addEventListener('click', () => loadImageView(currentIndex - 1));
    fsToggleBtn.addEventListener('click', toggleFullScreen);

    // Listen for fullscreen change events (standard and vendor prefixed just in case)
    document.addEventListener('fullscreenchange', updateFsButtonIcon);
    document.addEventListener('webkitfullscreenchange', updateFsButtonIcon);
    document.addEventListener('mozfullscreenchange', updateFsButtonIcon);
    document.addEventListener('MSFullscreenChange', updateFsButtonIcon);

    // Keyboard navigation support (optional but good UX)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') loadImageView(currentIndex + 1);
        if (e.key === 'ArrowLeft') loadImageView(currentIndex - 1);
    });

});