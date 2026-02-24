document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const readingView = document.getElementById('reading-view');
    const bgm = document.getElementById('bgm');
    const muteBtn = document.getElementById('mute-btn');
    let isOpened = false;

    // Debug: check if audio element and source are accessible
    console.log('BGM element:', bgm);
    console.log('BGM src:', bgm ? bgm.currentSrc || bgm.querySelector('source')?.src : 'not found');
    if (bgm) {
        bgm.addEventListener('error', (e) => console.error('BGM load error:', e, bgm.error));
        bgm.addEventListener('canplay', () => console.log('BGM ready to play'));
        bgm.load(); // Force load
    }

    // Audio Playback Function
    const playAudio = () => {
        console.log('playAudio called, bgm:', bgm, 'paused:', bgm?.paused, 'readyState:', bgm?.readyState);
        // Play BGM
        if (bgm && bgm.paused) {
            bgm.volume = 0.5;
            bgm.play()
                .then(() => console.log('BGM playing!'))
                .catch(e => console.error('BGM play failed:', e));
        }
    };

    // Mute/Unmute Toggle
    muteBtn.addEventListener('click', () => {
        if (bgm.muted) {
            bgm.muted = false;
            sfxOpen.muted = false;
            muteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
            if (isOpened) playAudio(); // Resume if already open
        } else {
            bgm.muted = true;
            sfxOpen.muted = true;
            muteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
        }
    });

    // Envelope Interaction
    envelope.addEventListener('click', () => {
        if (!isOpened) {
            isOpened = true;
            envelope.classList.add('open');
            envelopeWrapper.classList.add('open');

            // Play audio IMMEDIATELY on click (must be within user gesture context for HTTPS)
            playAudio();

            // Show content fade in after short delay to match animation
            setTimeout(() => {
                const letterContent = document.querySelector('.letter-content');
                if (letterContent) letterContent.style.opacity = '1';

                // Trigger Confetti
                startConfetti();

                // Show Reading View
                setTimeout(() => {
                    readingView.classList.add('active');
                }, 800);

            }, 200);
        }
    });

    // Multi-page Letter Content
    const pages = [
        `<p>Dear Autumn,</p>
         <p>Hi Autumn, Happy Birthday!

There are many things I could say, but today I don't want to speak from what we were, and I don't want to speak heavily.

You matter to me, that hasn't changed.

<p>I know you're still focusing on healing and genuinely respect that. Choosing yourself takes a lot of strength and courage, to let go of things that we truly love. I believe it never pushed me away from you, it made me admire you more. </p>`,

        `<p>I didn't want your birthday to pass without you knowing that someone out here still sees you, appreciates you and still hold you in a sincere place in my heart.

Truthfully, loving and still caring for you never felt chaotic to me. It always felt like a calm breeze in a coffee shop playing soft jazz. </p>
         <p>Wherever you are in your journey, I hope this year feels lighter for you. genuinely hoping you feel supported, understood, and at peace no matter where you go. You always deserve that kind of stability, you deserve days that feels safe. I hope you are filled with love from people around you during your special day! </p>`,

        `<p>I’m also thankful for the nights we played chess. Even when I kept losing and never won, those small moments helped ease the stress of long school days and org work. I hope you enjoyed them as much as I did. ^°^<p>

<p>I just want to appreciate your existence as you turn 21 today and I'm forever grateful that I met you and you became a part of my life = )<p>

<p>Happiest birthday Autumn. Enjoy your day! </p>
<p>With love, </p>
         <p>Nilo.</p>`
    ];

    let currentPage = 0;
    const letterBody = document.getElementById('letter-body');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNum = document.getElementById('page-num');
    const signature = document.querySelector('.signature');

    // Hide init signature as it's in the last page now or managed dynamically
    if (signature) signature.style.display = 'none';

    const updatePage = () => {
        letterBody.innerHTML = pages[currentPage];
        pageNum.innerText = `${currentPage + 1} / ${pages.length}`;

        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === pages.length - 1;
    };

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePage();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updatePage();
        }
    });

    // Initialize first page
    updatePage();

    // Close Button Logic (Reset Envelope)
    const closeBtn = document.getElementById('close-letter');
    closeBtn.addEventListener('click', () => {
        readingView.classList.remove('active');

        // Wait for fade out, then close envelope
        setTimeout(() => {
            envelope.classList.remove('open');
            envelopeWrapper.classList.remove('open');
            isOpened = false; // Allow re-opening

            // Optional: Reset to page 1
            currentPage = 0;
            updatePage();
        }, 500);
    });

    // Sparkle Effect
    const createSparkle = () => {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkle.style.animationDuration = Math.random() * 2 + 1 + 's';
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 2000);
    };
    setInterval(createSparkle, 200);

    // Autumn & Lily Background Effects (Emoji Version)
    const createAutumnLeaf = () => {
        const leaf = document.createElement('div');
        leaf.classList.add('autumn-leaf');
        leaf.innerHTML = '🍁';
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.animationDuration = Math.random() * 5 + 5 + 's';
        leaf.style.fontSize = Math.random() * 20 + 20 + 'px';
        document.body.appendChild(leaf);
        setTimeout(() => leaf.remove(), 10000); // Cleanup
    };

    setInterval(createAutumnLeaf, 500); // Falling autumn leaves

    // Mouse Trail Effect
    let throttleTimer;
    document.addEventListener('mousemove', (e) => {
        if (!throttleTimer) {
            throttleTimer = setTimeout(() => {
                const trail = document.createElement('div');
                trail.innerHTML = '✨'; // Star character
                trail.style.position = 'absolute';
                trail.style.left = e.pageX + 'px';
                trail.style.top = e.pageY + 'px';
                trail.style.pointerEvents = 'none';
                trail.style.fontSize = '1.2rem';
                trail.style.animation = 'fadeUp 1s ease-out forwards';
                trail.style.zIndex = '9999'; // Very high
                document.body.appendChild(trail);
                setTimeout(() => trail.remove(), 1000);
                throttleTimer = null;
            }, 50); // Throttle to prevent lagging
        }
    });

    // Add keyframes for trail dynamically if not in CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes fadeUp {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-20px) scale(0.5); }
        }
    `;
    document.head.appendChild(styleSheet);

    // Confetti Implementation (Simple Version)
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#FF007F', '#FFD700', '#00E5FF', '#FF69B4', '#FFFFFF'];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10; // Start above screen
            this.size = Math.random() * 10 + 5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, this.size, this.size);
            ctx.restore();
        }
    }

    function startConfetti() {
        // Burst style
        for (let i = 0; i < 200; i++) {
            particles.push(new Particle());
        }
        animateConfetti();
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();
            // Remove particles off screen
            if (p.y > canvas.height) {
                particles.splice(index, 1);
            }
        });

        if (particles.length > 0) {
            requestAnimationFrame(animateConfetti);
        }
    }

    // Resize handling
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
