<script setup lang="ts">
const { t, locale } = useI18n()
</script>

<template>
  <footer class="border-t border-border pb-24 pt-8 nav:pb-8">
    <div class="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
      <p class="text-xs text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} {{ t('footer.copyright') }}
        <span aria-hidden="true"> · </span>
        <a href="tel:+33628087180" class="underline-offset-4 transition-colors duration-300 hover:text-foreground hover:underline">+33 6 28 08 71 80</a>
        <template v-if="locale === 'fr'">
          <span aria-hidden="true"> · </span>
          <NuxtLink to="/developpeur-web-chambery" class="underline underline-offset-4 decoration-border transition-colors duration-300 hover:text-foreground hover:decoration-foreground">
            {{ t('footer.localLink') }}
          </NuxtLink>
        </template>
      </p>
      <a
        href="https://github.com/emricooo/portfolio-emeric-guyon"
        target="_blank"
        rel="noopener"
        class="text-xs text-muted-foreground underline underline-offset-4 decoration-border transition-colors duration-300 hover:text-foreground hover:decoration-foreground"
      >
        {{ t('footer.source') }}
      </a>
    </div>
  </footer>
</template>
