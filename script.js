const canvas = document.querySelector("#lume-field");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let particles = [];

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(86, Math.floor(width / 16)) }, createParticle);
}

function createParticle() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.8 + Math.random() * 2.6,
    vx: -0.18 + Math.random() * 0.36,
    vy: -0.2 - Math.random() * 0.35,
    hue: Math.random() > 0.55 ? 168 : Math.random() > 0.5 ? 214 : 335,
    alpha: 0.14 + Math.random() * 0.34,
  };
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createRadialGradient(width * 0.48, height * 0.42, 0, width * 0.48, height * 0.42, Math.max(width, height) * 0.7);
  gradient.addColorStop(0, "rgba(101, 167, 255, 0.10)");
  gradient.addColorStop(0.42, "rgba(113, 224, 188, 0.045)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.y < -20 || particle.x < -20 || particle.x > width + 20) {
      Object.assign(particle, createParticle(), { y: height + 16 });
    }
    ctx.beginPath();
    ctx.fillStyle = `hsla(${particle.hue}, 92%, 72%, ${particle.alpha})`;
    ctx.shadowColor = `hsla(${particle.hue}, 92%, 68%, 0.65)`;
    ctx.shadowBlur = 18;
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
draw();
