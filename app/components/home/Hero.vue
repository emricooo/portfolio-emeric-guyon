<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { t } = useI18n()

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  const tl = gsap.timeline()

  // === Code zone fades in ===
  tl.fromTo('.hero-code-zone', { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.out' }, 0)

  // === Scroll indicator ===
  tl.from('.hero-scroll-indicator', { opacity: 0, duration: 0.6 }, 2.0)
})
</script>

<template>
  <section
    id="home"
    class="relative flex min-h-screen items-center justify-center overflow-hidden"
    :aria-label="t('hero.ariaLabel')"
  >
    <!-- Canvas: code background with name revealed through color contrast (aria-hidden via component root) -->
    <HomeHeroCodeBackground />

    <!-- H1 for SSR / SEO / screen readers — canvas paints the name visually but is aria-hidden -->
    <h1 class="sr-only">{{ t('hero.name') }} — {{ t('hero.baseline') }}</h1>

    <!-- Scroll indicator (decorative — visual cue only, not announced to AT) -->
    <div
      class="hero-scroll-indicator absolute bottom-47.5 left-1/2 z-10 -translate-x-1/2 nav:bottom-8"
      aria-hidden="true"
    >
      <div class="animate-scroll-pulse flex flex-col items-center gap-2">
        <div class="h-10 w-px bg-linear-to-b from-transparent to-muted-foreground" />
        <span class="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
      </div>
    </div>
  </section>
</template>
