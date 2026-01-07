<template>
  <div class="particle-container" ref="container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
const container = ref(null);
let animationId = null;
let particles = [];

onMounted(() => {
  initParticles();
  animate();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', handleResize);
});

function handleResize() {
  if (!container.value || !canvas.value) return;
  canvas.value.width = container.value.offsetWidth;
  canvas.value.height = container.value.offsetHeight;
  // Re-init particles on resize to avoid stretching
  particles = [];
  initParticles();
}

function initParticles() {
  if (!container.value || !canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  canvas.value.width = container.value.offsetWidth;
  canvas.value.height = container.value.offsetHeight;
  
  // Create particles
  // Adjust count based on screen size for performance
  const particleCount = window.innerWidth < 768 ? 50 : 100;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.value.width,
      y: Math.random() * canvas.value.height,
      size: Math.random() * 3,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      color: ['#00f0ff', '#ff00ff', '#0066ff'][Math.floor(Math.random() * 3)]
    });
  }
}

function animate() {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  
  particles.forEach(particle => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    
    // Wrap around edges
    if (particle.x < 0) particle.x = canvas.value.width;
    if (particle.x > canvas.value.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.value.height;
    if (particle.y > canvas.value.height) particle.y = 0;
    
    // Draw
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
  
  animationId = requestAnimationFrame(animate);
}
</script>

<style scoped>
.particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
