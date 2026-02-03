<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t, locale } = useI18n()

const isNotFound = computed(() => props.error?.statusCode === 404)

const title = computed(() => {
  if (isNotFound.value) return locale.value === 'fr' ? 'Page introuvable' : 'Page not found'
  return locale.value === 'fr' ? 'Une erreur est survenue' : 'Something went wrong'
})

const subtitle = computed(() => {
  if (isNotFound.value) {
    return locale.value === 'fr'
      ? 'Cette URL n\'existe pas ou plus. Vérifie le lien, ou retourne à l\'accueil.'
      : 'This URL doesn\'t exist or has moved. Check the link or head back home.'
  }
  return locale.value === 'fr'
    ? 'Quelque chose a mal tourné. Réessaie ou contacte-moi.'
    : 'Something went wrong. Try again or get in touch.'
})

const homeLabel = computed(() => locale.value === 'fr' ? 'Retour à l\'accueil' : 'Back to home')
const contactLabel = computed(() => t('nav.cta'))

function clearError() {
  return navigateTo('/')
}

// Remove anti-FOUC loading state (set globally by inline head script).
// error.vue doesn't go through default.vue layout, so we replicate the cleanup here.
onMounted(() => {
  nextTick(() => {
    document.documentElement.style.opacity = '1'
    document.documentElement.classList.remove('app-loading')
  })
})

useHead({
  title: () => `${title.value} — Emeric Guyon`,
  meta: [
    { name: 'robots', content: isNotFound.value ? 'noindex, follow' : 'noindex, nofollow' },
  ],
})
</script>

<template>
  <div class="grain min-h-screen bg-background font-sans text-foreground">
    <main class="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      <!-- Big status code -->
      <div
        class="font-display text-[28vw] font-bold leading-none text-foreground/[0.06] md:text-[20vw] lg:text-[16rem]"
        aria-hidden="true"
      >
        {{ error?.statusCode ?? 404 }}
      </div>

      <!-- Content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center px-6">
        <span class="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {{ error?.statusCode ?? 404 }} · {{ isNotFound ? '404' : 'error' }}
        </span>

        <h1 class="mt-6 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
          {{ title }}
        </h1>

        <p class="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
          {{ subtitle }}
        </p>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-foreground/40"
            @click="clearError"
          >
            ← {{ homeLabel }}
          </button>
          <a
            href="/#contact"
            class="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/85"
          >
            {{ contactLabel }}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </main>
  </div>
</template>
