
    const confettiCanvas = document.getElementById('confetti-canvas');
    const cctx = confettiCanvas.getContext('2d');
    function resizeCanvas() { confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let confettiParticles = [];
    let confettiRunning = false;
    const confettiColors = ['#B9A6DC', '#C9A15F', '#E28A72', '#8CA37B', '#FBF6ED', '#6F5D93'];

    function fireConfetti(count = 150, originX = null, originY = null) {
      const ox = originX === null ? confettiCanvas.width / 2 : originX;
      const oy = originY === null ? -20 : originY;
      for (let i = 0; i < count; i++) {
        const shapeRoll = Math.random();
        confettiParticles.push({
          x: ox + (Math.random() - 0.5) * confettiCanvas.width * 0.55,
          y: oy - Math.random() * 80,
          vx: (Math.random() - 0.5) * 7,
          vy: 1.5 + Math.random() * 3.5,
          size: 5 + Math.random() * 7,
          rot: Math.random() * 360,
          vrot: (Math.random() - 0.5) * 12,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          shape: shapeRoll > 0.66 ? 'rect' : (shapeRoll > 0.33 ? 'circle' : 'heart'),
          sway: Math.random() * Math.PI * 2,
          life: 0,
          maxLife: 240 + Math.random() * 80
        });
      }
      if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(confettiLoop); }
    }

    /* fireworks-style burst from multiple points for extra celebration moments */
    function fireConfettiFireworks() {
      fireConfetti(110, confettiCanvas.width * 0.5, 0);
      setTimeout(() => fireConfetti(90, confettiCanvas.width * 0.15, confettiCanvas.height * 0.2), 220);
      setTimeout(() => fireConfetti(90, confettiCanvas.width * 0.85, confettiCanvas.height * 0.2), 420);
      setTimeout(() => fireConfetti(70, confettiCanvas.width * 0.5, confettiCanvas.height * 0.1), 650);
    }

    function drawHeart(ctx, size) {
      const s = size / 18;
      ctx.beginPath();
      ctx.moveTo(0, 4 * s);
      ctx.bezierCurveTo(-9 * s, -4 * s, -9 * s, -10 * s, 0, -6 * s);
      ctx.bezierCurveTo(9 * s, -10 * s, 9 * s, -4 * s, 0, 4 * s);
      ctx.closePath();
      ctx.fill();
    }

    function confettiLoop() {
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiParticles.forEach(p => {
        p.sway += 0.08;
        p.x += p.vx + Math.sin(p.sway) * 0.6; p.y += p.vy; p.vy += 0.045; p.rot += p.vrot; p.life++;
        const fade = Math.max(0, 1 - p.life / p.maxLife);
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot * Math.PI / 180);
        cctx.globalAlpha = fade;
        cctx.fillStyle = p.color;
        if (p.shape === 'rect') { cctx.fillRect(-p.size / 2, -p.size / 2 * 0.6, p.size, p.size * 0.6); }
        else if (p.shape === 'heart') { drawHeart(cctx, p.size); }
        else { cctx.beginPath(); cctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); cctx.fill(); }
        cctx.restore();
      });
      confettiParticles = confettiParticles.filter(p => p.life < p.maxLife && p.y < confettiCanvas.height + 40);
      if (confettiParticles.length > 0) {
        requestAnimationFrame(confettiLoop);
      } else {
        confettiRunning = false;
        cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    const ambient = document.getElementById('ambient');

    function heartSVG(color) {
      return `<svg width="${20 + Math.random() * 14}" height="${20 + Math.random() * 14}" viewBox="0 0 24 24" fill="${color}"><path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.3 6c-2.3 4.4-9.3 9-9.3 9Z"/></svg>`;
    }
    function balloonSVG(color) {
      return `<svg width="34" height="70" viewBox="0 0 34 70" fill="none"><ellipse cx="17" cy="24" rx="16" ry="20" fill="${color}"/><path d="M17 44 L14 50 L20 50 Z" fill="${color}"/><line x1="17" y1="50" x2="17" y2="70" stroke="${color}" stroke-width="1.2" opacity="0.6"/></svg>`;
    }

    const heartColors = ['#E28A72', '#B9A6DC', '#C9A15F'];
    const balloonColors = ['#B9A6DC', '#E28A72', '#8CA37B', '#C9A15F'];

    function spawnHeart() {
      const el = document.createElement('div');
      el.className = 'heart-particle';
      const color = heartColors[Math.floor(Math.random() * heartColors.length)];
      el.innerHTML = heartSVG(color);
      const left = Math.random() * 100;
      const duration = 9 + Math.random() * 6;
      const drift = (Math.random() * 60 - 30) + 'px';
      const rot = (Math.random() * 30 - 15) + 'deg';
      el.style.left = left + 'vw';
      el.style.setProperty('--drift', drift);
      el.style.setProperty('--rot', rot);
      el.style.animation = `rise ${duration}s ease-in forwards`;
      ambient.appendChild(el);
      setTimeout(() => el.remove(), duration * 1000 + 200);
    }

    function spawnBalloon() {
      const el = document.createElement('div');
      el.className = 'balloon-particle';
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      el.innerHTML = balloonSVG(color);
      const left = Math.random() * 90;
      const duration = 16 + Math.random() * 6;
      const drift = (Math.random() * 40 - 20) + 'px';
      const rot = (Math.random() * 10 - 5) + 'deg';
      el.style.left = left + 'vw';
      el.style.setProperty('--drift', drift);
      el.style.setProperty('--rot', rot);
      el.style.animation = `rise ${duration}s linear forwards`;
      ambient.appendChild(el);
      setTimeout(() => el.remove(), duration * 1000 + 200);
    }

    setInterval(spawnHeart, 1800);
    setInterval(spawnBalloon, 6500);
    setTimeout(spawnHeart, 400);
    setTimeout(spawnBalloon, 1200);

    const envelope = document.getElementById('envelope');
    const sceneEnvelope = document.getElementById('scene-envelope');
    const sceneLetter = document.getElementById('scene-letter');
    const sceneLoading = document.getElementById('scene-loading');
    const story = document.getElementById('story');

    let dragStartY = null;
    let dragging = false;
    let envelopeOpened = false;

    function openEnvelope() {
      if (envelopeOpened) return;
      envelopeOpened = true;
      envelope.classList.add('opening');
      setTimeout(() => {
        sceneEnvelope.classList.add('hidden');
        sceneLetter.classList.remove('hidden');
      }, 750);
    }

    envelope.addEventListener('pointerdown', (e) => {
      dragStartY = e.clientY;
      dragging = true;
      envelope.classList.add('dragging');
    });
    envelope.addEventListener('pointermove', (e) => {
      if (!dragging || dragStartY === null) return;
      const delta = dragStartY - e.clientY;
      if (delta > 0) {
        envelope.style.transform = `translateY(-${Math.min(delta, 80)}px)`;
      }
      if (delta > 55) {
        openEnvelope();
        dragging = false;
      }
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      envelope.classList.remove('dragging');
      envelope.style.transform = '';
    }
    envelope.addEventListener('pointerup', endDrag);
    envelope.addEventListener('pointercancel', endDrag);
    envelope.addEventListener('pointerleave', () => { if (dragging) { envelope.style.transform = ''; } });
    envelope.addEventListener('click', openEnvelope);

    /* SCENE 2 -> 3 : letter click anywhere */
    sceneLetter.addEventListener('click', () => {
      sceneLetter.classList.add('hidden');
      sceneLoading.classList.remove('hidden');
      setTimeout(() => {
        sceneLoading.classList.add('hidden');
        story.classList.add('visible');
        document.body.style.overflow = 'auto';
        setTimeout(() => { fireConfettiFireworks(); }, 350);
      }, 2100);
    });

    /* lock scroll until story revealed */
    document.body.style.overflow = 'hidden';

 

    const readMoreBtn = document.getElementById('readMoreBtn');
    const sceneFinalLetter = document.getElementById('scene-finalletter');
    readMoreBtn.addEventListener('click', () => {
      sceneFinalLetter.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      fireConfettiFireworks();
    });

    const friendPhoto = document.getElementById('friend-photo');
    const fallbackSVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 375">
  <rect width="300" height="375" fill="#DCD1EE"/>
  <circle cx="105" cy="150" r="34" fill="#B9A6DC"/>
  <circle cx="195" cy="150" r="34" fill="#E28A72"/>
  <path d="M150 190 C 120 220, 120 250, 150 275 C 180 250, 180 220, 150 190 Z" fill="#6F5D93"/>
  <text x="150" y="330" font-family="Georgia,serif" font-size="17" fill="#6F5D93" text-anchor="middle">your photo goes here</text>
</svg>`)}`;
    friendPhoto.addEventListener('error', function () { this.src = fallbackSVG; }, { once: true });


    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); }
      });
    }, { threshold: 0.25 });
    revealEls.forEach(el => io.observe(el));

    let audioCtx = null;
    let songTimer = null;
    let songPlaying = false;
    const melody = [
      { f: 523.25, d: 0.32 }, { f: 587.33, d: 0.32 }, { f: 659.25, d: 0.32 }, { f: 783.99, d: 0.46 },
      { f: 659.25, d: 0.32 }, { f: 880.00, d: 0.32 }, { f: 783.99, d: 0.6 }, { f: 0, d: 0.3 },
    ];
    function playNote(freq, startTime, dur) {
      if (freq === 0) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + dur + 0.05);
    }
    function scheduleLoop() {
      const now = audioCtx.currentTime + 0.05;
      let t = now;
      let total = 0;
      melody.forEach(n => { playNote(n.f, t, n.d * 0.9); t += n.d; total += n.d; });
      songTimer = setTimeout(scheduleLoop, total * 1000);
    }
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const eqBars = document.getElementById('eqBars');
    playBtn.addEventListener('click', () => {
      if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      if (audioCtx.state === 'suspended') { audioCtx.resume(); }
      songPlaying = !songPlaying;
      if (songPlaying) {
        scheduleLoop();
        playIcon.style.display = 'none'; pauseIcon.style.display = 'block';
        eqBars.classList.add('playing');
      } else {
        clearTimeout(songTimer);
        playIcon.style.display = 'block'; pauseIcon.style.display = 'none';
        eqBars.classList.remove('playing');
      }
    });


    document.querySelectorAll('[data-card]').forEach(card => {
      card.addEventListener('click', () => { card.classList.toggle('flipped'); });
    });


    document.querySelectorAll('[data-scratch]').forEach(container => {
      const text = container.getAttribute('data-text');
      const reveal = document.createElement('div');
      reveal.className = 'scratch-reveal';
      reveal.innerHTML = `<p>${text}</p>`;
      container.appendChild(reveal);

      const canvas = document.createElement('canvas');
      canvas.className = 'scratch-canvas';
      container.appendChild(canvas);

      const hint = document.createElement('div');
      hint.className = 'scratch-hint';
      hint.textContent = 'scratch me';
      container.appendChild(hint);

      function setup() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width; canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
        grad.addColorStop(0, '#C9A15F');
        grad.addColorStop(1, '#B9A6DC');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        for (let i = 0; i < rect.width; i += 8) {
          ctx.fillRect(i, 0, 1, rect.height);
        }
        return ctx;
      }
      let ctx = setup();
      let scratching = false;
      let sampleCount = 0;

      function scratchAt(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();
      }
      function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
      function checkCleared() {
        sampleCount++;
        if (sampleCount % 6 !== 0) return;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let cleared = 0, total = 0;
        for (let i = 3; i < data.length; i += 4 * 40) { total++; if (data[i] < 80) cleared++; }
        if (total > 0 && cleared / total > 0.45) {
          canvas.style.transition = 'opacity .5s ease';
          canvas.style.opacity = '0';
          canvas.style.pointerEvents = 'none';
          hint.style.display = 'none';
        }
      }
      canvas.addEventListener('pointerdown', (e) => { scratching = true; const p = getPos(e); scratchAt(p.x, p.y); });
      canvas.addEventListener('pointermove', (e) => { if (!scratching) return; const p = getPos(e); scratchAt(p.x, p.y); checkCleared(); });
      window.addEventListener('pointerup', () => { scratching = false; });
      window.addEventListener('resize', () => { ctx = setup(); });
    });