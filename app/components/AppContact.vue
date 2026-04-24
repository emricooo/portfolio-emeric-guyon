<script setup lang="ts">
const { t } = useI18n()
const { animateOnScroll, letterReveal, wordReveal } = useScrollAnimation()

// Animations
letterReveal('.contact-label')
wordReveal('.contact-subtitle', 0.2)
animateOnScroll('.contact-form-wrapper', { y: 20, duration: 0.5, delay: 0.6 })
animateOnScroll('.contact-socials', { y: 20, duration: 0.5, delay: 0.7 })
animateOnScroll('.contact-baseline', { y: 20, duration: 0.5, delay: 1.0 })
animateOnScroll('.contact-location', { y: 20, duration: 0.5, delay: 1.1 })
</script>

<template>
  <section id="contact" class="relative bg-muted py-20 lg:py-32">
    <div class="relative z-10 mx-auto max-w-7xl px-4 md:px-8">

      <!-- Bloc 1 — flex row : subtitle gauche, liens droite -->
      <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
        <!-- Left: label + subtitle + socials -->
        <div class="w-full md:max-w-xl">
          <span class="section-label contact-label">{{ t('contact.label') }}</span>
          <p class="section-title contact-subtitle mt-4">
            {{ t('contact.subtitle') }}
          </p>
          <div class="contact-socials mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <a
              href="https://www.linkedin.com/in/emeric-guyon/"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <span class="text-muted-foreground/40" aria-hidden="true">·</span>
            <a
              href="https://github.com/emricooo"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <span class="text-muted-foreground/40" aria-hidden="true">·</span>
            <a
              href="mailto:hello@emericguyon.com"
              class="transition-colors hover:text-foreground"
            >
              hello@emericguyon.com
            </a>
          </div>
        </div>

        <!-- Right: contact form -->
        <div class="contact-form-wrapper w-full md:max-w-md">
          <ContactForm />
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
