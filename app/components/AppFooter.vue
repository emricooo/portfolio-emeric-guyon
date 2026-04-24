<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border pb-24 nav:pb-0">
    <!-- Block 1 — Signature (edge-to-edge) -->
    <div class="px-4 pt-12 pb-8 md:px-8">
      <span
        class="footer-signature block w-full select-none whitespace-nowrap font-semibold uppercase leading-none tracking-[-0.05em] text-foreground/40 transition-colors duration-300 hover:text-foreground"
        style="font-size: clamp(60px, 18vw, 280px)"
      >
        {{ t('hero.name') }}
      </span>
    </div>

    <!-- Block 2 — Utility row -->
    <div class="border-t border-border px-4 py-6 md:px-8">
      <div class="mx-auto flex max-w-[1280px] flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <!-- Left group: status -->
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>&copy; {{ year }}</span>
          <span class="text-muted-foreground/40" aria-hidden="true">·</span>
          <FooterClock />
          <span class="text-muted-foreground/40" aria-hidden="true">·</span>
          <span class="inline-flex items-center gap-2">
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
            {{ t('footer.available') }}
          </span>
        </div>

        <!-- Right group: socials -->
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href="https://www.linkedin.com/in/emeric-guyon/"
            target="_blank"
            rel="noopener"
            class="transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <span class="text-muted-foreground/40" aria-hidden="true">·</span>
          <a
            href="https://github.com/emricooo"
            target="_blank"
            rel="noopener"
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
    </div>

    <!-- Block 3 — Colophon + theme toggle -->
    <div class="border-t border-border/60 px-4 py-4 md:px-8">
      <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground/60">
        <p>
          {{ t('footer.builtWith') }}
          <a href="https://nuxt.com" target="_blank" rel="noopener" class="transition-colors hover:text-foreground">Nuxt</a>
          <span aria-hidden="true"> · </span>
          <a href="https://gsap.com" target="_blank" rel="noopener" class="transition-colors hover:text-foreground">GSAP</a>
          <span aria-hidden="true"> · </span>
          <a href="https://tailwindcss.com" target="_blank" rel="noopener" class="transition-colors hover:text-foreground">Tailwind</a>
        </p>
        <ThemeToggle />
      </div>
    </div>
  </footer>
</template>
