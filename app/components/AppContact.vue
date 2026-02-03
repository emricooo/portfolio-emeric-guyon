<script setup lang="ts">
const { t } = useI18n()
const { animateOnScroll, letterReveal, wordReveal } = useScrollAnimation()

// Animations
letterReveal('.contact-label')
wordReveal('.contact-subtitle', 0.2)
animateOnScroll('.contact-email', { y: 20, duration: 0.5, delay: 0.6 })
animateOnScroll('.contact-links', { y: 20, duration: 0.5, delay: 0.8 })
animateOnScroll('.contact-baseline', { y: 20, duration: 0.5, delay: 1.0 })
animateOnScroll('.contact-location', { y: 20, duration: 0.5, delay: 1.1 })
</script>

<template>
  <section id="contact" class="relative bg-muted py-20 lg:py-32">
    <div class="relative z-10 mx-auto max-w-7xl px-4 md:px-8">

      <!-- Bloc 1 — flex row : subtitle gauche, liens droite -->
      <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
        <!-- Left: label + subtitle -->
        <div class="w-full md:max-w-xl">
          <span class="section-label contact-label">{{ t('contact.label') }}</span>
          <p class="section-title contact-subtitle mt-4">
            {{ t('contact.subtitle') }}
          </p>
        </div>

        <!-- Right: contact info -->
        <div class="space-y-4 text-left md:text-right">
          <a
            href="mailto:hello@emericguyon.com"
            class="contact-email group relative inline-block text-base text-foreground underline underline-offset-4"
            data-cursor-hover
          >
            hello@emericguyon.com
          </a>
          <div class="contact-links flex flex-col items-start gap-1 md:items-end">
            <a href="tel:+33628087180" class="nav-link relative inline-block text-sm text-muted-foreground transition-colors hover:text-foreground w-fit">{{ t('contact.phone') }}</a>
            <a
              href="https://www.linkedin.com/in/emeric-guyon/"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-link relative inline-block text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/emricooo"
              target="_blank"
              rel="noopener noreferrer"
              class="nav-link relative inline-block text-sm text-muted-foreground transition-colors hover:text-foreground w-fit"
            >
              Github
            </a>
          </div>
        </div>
      </div>

      <!-- Bloc 2 — full width : baseline + géo -->
      <div class="mt-8">
        <p class="contact-baseline text-sm text-muted-foreground md:text-base">
          {{ t('hero.baseline') }}
        </p>
        <p class="contact-location mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">
          {{ t('hero.location') }}
        </p>
      </div>

    </div>
  </section>
</template>
