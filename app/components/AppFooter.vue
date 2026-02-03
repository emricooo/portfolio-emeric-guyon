<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="border-t border-border px-4 pb-24 pt-8 nav:pb-8 md:px-8">
    <div class="mx-auto max-w-[1280px]">
      <div class="flex items-center justify-between">
        <p class="text-xs text-muted-foreground">
          &copy; {{ new Date().getFullYear() }} {{ t('footer.copyright') }}
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
    </div>
  </footer>
</template>
