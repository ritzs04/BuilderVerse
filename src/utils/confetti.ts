import confetti from 'canvas-confetti';

/**
 * Trigger celebratory confetti burst when a project is completed
 */
export function triggerProjectConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors: ['#A65F79', '#E6B9C8', '#47765C', '#C29336', '#FFFFFF', '#F5DCE3', '#F59E0B']
    });
  }

  // Realistic firework cluster
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });

  // Left & Right cannon blasts after 250ms
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#A65F79', '#E6B9C8', '#C29336', '#47765C'],
      zIndex: 9999
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#A65F79', '#E6B9C8', '#C29336', '#47765C'],
      zIndex: 9999
    });
  }, 250);
}

/**
 * Trigger celebratory floral/blush confetti when a learning path is mastered
 */
export function triggerPathCompleteConfetti() {
  const end = Date.now() + 1.2 * 1000;
  const colors = ['#A65F79', '#E6B9C8', '#F5DCE3', '#47765C', '#FDECEF', '#FFFFFF'];

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
      zIndex: 9999
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
      zIndex: 9999
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
