// ==========================================================================
// SHWETA'S PORTFOLIO - SCRIPT & INTERACTIVITY
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sound Effects via Web Audio API (No external assets required!) ---
  let soundEnabled = true;
  const audioContext = window.AudioContext ? new (window.AudioContext || window.webkitAudioContext)() : null;

  function playTone(freq, type, duration, delay = 0) {
    if (!soundEnabled || !audioContext) return;
    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      setTimeout(() => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        gain.gain.setValueAtTime(0.12, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + duration);
      }, delay);
    } catch (e) {
      console.log('Audio disabled/not supported');
    }
  }

  function playSuccessJingle() {
    // Action Kamen victory motif!
    playTone(523.25, 'triangle', 0.15, 0);    // C5
    playTone(659.25, 'triangle', 0.15, 120);  // E5
    playTone(783.99, 'triangle', 0.18, 240);  // G5
    playTone(1046.50, 'square', 0.35, 380);   // C6
  }

  function playClickSound() {
    playTone(400, 'sine', 0.08, 0);
  }

  // Audio Toggle Button
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      audioToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
      audioToggleBtn.title = soundEnabled ? 'Mute Sounds' : 'Unmute Sounds';
      if (soundEnabled) playClickSound();
    });
  }

  // --- 2. Mobile Menu Navigation ---
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      playClickSound();
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // --- 3. Interactive Tank Cleaning Simulator ---
  const simDeployBtn = document.getElementById('simDeployBtn');
  const simResetBtn = document.getElementById('simResetBtn');
  const simRobot = document.getElementById('simRobot');
  const simSludge = document.getElementById('simSludge');
  const simAlgaeLeft = document.getElementById('simAlgaeLeft');
  const simAlgaeRight = document.getElementById('simAlgaeRight');
  const simWater = document.getElementById('simWater');
  const simStatus = document.getElementById('simStatus');
  const simProgress = document.getElementById('simProgress');

  let isCleaning = false;
  let cleanProgressInterval = null;

  if (simDeployBtn && simResetBtn) {
    simDeployBtn.addEventListener('click', () => {
      if (isCleaning) return;
      isCleaning = true;
      playClickSound();

      simDeployBtn.disabled = true;
      simDeployBtn.style.opacity = '0.6';
      simStatus.textContent = '🚀 Cleaning in Progress...';
      simStatus.style.background = '#FEF08A';

      // Deploy robot into tank
      simRobot.classList.add('deployed');

      let currentPercent = 0;
      cleanProgressInterval = setInterval(() => {
        currentPercent += 5;
        if (simProgress) simProgress.textContent = `${currentPercent}% Cleaned`;

        // At 30%, sludge starts vanishing
        if (currentPercent >= 30) {
          simSludge.style.height = '15px';
          simSludge.style.opacity = '0.7';
        }

        // At 60%, algae clears
        if (currentPercent >= 60) {
          simAlgaeLeft.style.opacity = '0.1';
          simAlgaeRight.style.opacity = '0.1';
          simSludge.style.height = '0px';
          simSludge.style.opacity = '0';
        }

        // At 85%, water turns sparkling clean
        if (currentPercent >= 85) {
          simWater.classList.remove('murky');
        }

        // 100% Finished!
        if (currentPercent >= 100) {
          clearInterval(cleanProgressInterval);
          simStatus.textContent = '✨ 100% Sanitized & Safe!';
          simStatus.style.background = '#86EFAC';
          simDeployBtn.disabled = false;
          simDeployBtn.style.opacity = '1';
          isCleaning = false;
          playSuccessJingle();
        }
      }, 150);
    });

    simResetBtn.addEventListener('click', () => {
      if (cleanProgressInterval) clearInterval(cleanProgressInterval);
      isCleaning = false;
      playClickSound();

      simRobot.classList.remove('deployed');
      simSludge.style.height = '45px';
      simSludge.style.opacity = '1';
      simAlgaeLeft.style.opacity = '1';
      simAlgaeRight.style.opacity = '1';
      simWater.classList.add('murky');
      simStatus.textContent = '⚠️ Dirty & Sludgy';
      simStatus.style.background = '#FECACA';
      if (simProgress) simProgress.textContent = '0% Cleaned';
      simDeployBtn.disabled = false;
      simDeployBtn.style.opacity = '1';
    });
  }

  // --- 4. Tank ROI & Impact Calculator ---
  const tankChips = document.querySelectorAll('.tank-chip');
  const metricTimeSaved = document.getElementById('metricTimeSaved');
  const metricWaterSaved = document.getElementById('metricWaterSaved');
  const metricHygiene = document.getElementById('metricHygiene');
  const metricRisk = document.getElementById('metricRisk');

  const tankMetrics = {
    '500': { time: '90 Mins', water: '180 Liters', hygiene: '99.5%', risk: '0% (Safe)' },
    '1000': { time: '135 Mins', water: '350 Liters', hygiene: '99.8%', risk: '0% (Safe)' },
    '2000': { time: '210 Mins', water: '650 Liters', hygiene: '99.9%', risk: '0% (Safe)' },
    '5000': { time: '360 Mins', water: '1500 Liters', hygiene: '99.9%', risk: '0% (Safe)' }
  };

  tankChips.forEach(chip => {
    chip.addEventListener('click', () => {
      tankChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      playClickSound();

      const size = chip.getAttribute('data-size');
      if (tankMetrics[size]) {
        if (metricTimeSaved) metricTimeSaved.textContent = tankMetrics[size].time;
        if (metricWaterSaved) metricWaterSaved.textContent = tankMetrics[size].water;
        if (metricHygiene) metricHygiene.textContent = tankMetrics[size].hygiene;
        if (metricRisk) metricRisk.textContent = tankMetrics[size].risk;
      }
    });
  });

  // --- 5. Shinchan Quotes Generator ---
  const shinchanQuotes = [
    "“Action Kamen says: Clean drinking water gives you maximum strength! Wahahaha! ⚡”",
    "“Why enter a creepy dark tank with slimy walls when a cute robot can do the dirty work? 🤖”",
    "“Mom (Misae) won't shout at anyone for delayed tank cleaning anymore! Safe & sound! 🏡”",
    "“Engineering is fun! We can solve real problems and still have time for Chocobi snacks! 🍪”",
    "“Kasukabe Defense Force Rule #1: Protect human health with autonomous innovation! 🛡️”",
    "“Shiro inspected the tank after cleaning... He gave it 4 wags out of 4! 🐶”"
  ];

  const quoteBox = document.getElementById('shinchanQuoteText');
  const nextQuoteBtn = document.getElementById('nextQuoteBtn');
  let currentQuoteIndex = 0;

  if (nextQuoteBtn && quoteBox) {
    nextQuoteBtn.addEventListener('click', () => {
      playClickSound();
      currentQuoteIndex = (currentQuoteIndex + 1) % shinchanQuotes.length;
      quoteBox.style.opacity = '0';
      setTimeout(() => {
        quoteBox.textContent = shinchanQuotes[currentQuoteIndex];
        quoteBox.style.opacity = '1';
      }, 150);
    });
  }

  // --- 6. Botpress Chatbot Floating Callout Helper ---
  const botpressSpeechCard = document.getElementById('botpressSpeechCard');
  const botpressCloseBtn = document.getElementById('botpressCloseBtn');
  const botpressTriggerBtn = document.getElementById('botpressTriggerBtn');
  const heroChatTrigger = document.getElementById('heroChatTrigger');

  function openBotpressChat() {
    playClickSound();
    // Botpress Webchat v5 API triggers
    if (window.botpress && typeof window.botpress.open === 'function') {
      window.botpress.open();
    } else if (window.botpressWebChat && typeof window.botpressWebChat.send === 'function') {
      window.botpressWebChat.send({ type: 'show' });
    } else {
      // Find and click the botpress webchat floating bubble button if rendered in DOM
      const bpFloatingButton = document.querySelector('.bpw-floating-button, [aria-label="Open Webchat"], #bp-web-widget-container button, iframe');
      if (bpFloatingButton) {
        bpFloatingButton.click();
      }
    }
  }

  if (botpressCloseBtn && botpressSpeechCard) {
    botpressCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      botpressSpeechCard.style.display = 'none';
    });
  }

  if (botpressTriggerBtn) {
    botpressTriggerBtn.addEventListener('click', openBotpressChat);
  }

  if (heroChatTrigger) {
    heroChatTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openBotpressChat();
    });
  }

  // --- 7. Contact Form Simulation ---
  const contactForm = document.getElementById('contactForm');
  const formSuccessMsg = document.getElementById('formSuccessMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSuccessJingle();
      if (formSuccessMsg) {
        formSuccessMsg.style.display = 'block';
        formSuccessMsg.textContent = '🎉 Woohoo! Message sent to Shweta! Thanks for reaching out!';
      }
      contactForm.reset();
      setTimeout(() => {
        if (formSuccessMsg) formSuccessMsg.style.display = 'none';
      }, 6000);
    });
  }
});
