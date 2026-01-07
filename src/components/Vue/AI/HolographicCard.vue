<template>
  <div 
    class="holographic-card glass"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    :style="cardStyle"
  >
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="holographic-overlay"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const rotateX = ref(0);
const rotateY = ref(0);
const glowX = ref(50);
const glowY = ref(50);

const cardStyle = computed(() => ({
  transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
  '--glow-x': `${glowX.value}%`,
  '--glow-y': `${glowY.value}%`,
}));

function handleMouseMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  rotateY.value = ((x / rect.width) - 0.5) * 20;
  rotateX.value = ((y / rect.height) - 0.5) * -20;
  
  glowX.value = (x / rect.width) * 100;
  glowY.value = (y / rect.height) * 100;
}

function handleMouseLeave() {
  rotateX.value = 0;
  rotateY.value = 0;
  glowX.value = 50;
  glowY.value = 50;
}
</script>

<style scoped>
.holographic-card {
  position: relative;
  transition: transform 0.1s ease;
  overflow: hidden;
  transform-style: preserve-3d;
}

.holographic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at var(--glow-x) var(--glow-y),
    rgba(0, 240, 255, 0.15) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 2;
}

.card-content {
  position: relative;
  z-index: 1;
}
</style>
