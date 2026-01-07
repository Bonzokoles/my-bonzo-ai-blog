<template>
  <div class="glitch-wrapper">
    <div class="glitch" :data-text="text">
      {{ text }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.glitch {
  position: relative;
  font-size: 3rem;
  font-weight: bold;
  color: var(--ai-cyan);
  animation: glitch 1s linear infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 var(--ai-magenta);
  clip: rect(24px, 550px, 90px, 0);
  animation: glitch-anim 3s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 var(--ai-electric-blue);
  clip: rect(85px, 550px, 140px, 0);
  animation: glitch-anim 2s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% { clip: rect(76px, 9999px, 2px, 0); }
  5% { clip: rect(23px, 9999px, 140px, 0); }
  10% { clip: rect(61px, 9999px, 24px, 0); }
  15% { clip: rect(98px, 9999px, 46px, 0); }
  20% { clip: rect(12px, 9999px, 10px, 0); }
  100% { clip: rect(45px, 9999px, 98px, 0); }
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}
</style>
