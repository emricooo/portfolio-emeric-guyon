<script setup lang="ts">
import { clients } from '~/data/clients'

const { t } = useI18n()
const { letterReveal, wordReveal, columnsReveal } = useScrollAnimation()

// Split clients into 5 balanced columns
const columns = computed(() => {
  const cols: string[][] = [[], [], [], [], []]
  clients.forEach((client, i) => {
    cols[i % 5]!.push(client)
  })
  return cols
})

// Animations
letterReveal('.clients-label')
wordReveal('.clients-title', 0.2)
columnsReveal('.clients-grid', '.clients-column', '.client-name')
</script>

<template>
  <section id="clients" class="relative py-20 lg:py-32">
    <div class="section-glow left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-amber" />

    <div class="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
      <span class="section-label clients-label">{{ t('clients.label') }}</span>
      <h2 class="section-title clients-title mt-4 mb-12">
        {{ t('clients.title') }}
      </h2>

      <div class="clients-grid grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 md:grid-cols-5">
        <div v-for="(col, colIndex) in columns" :key="colIndex" class="clients-column space-y-2">
          <span
            v-for="client in col"
            :key="client"
            class="client-name block text-sm text-muted-foreground"
          >
            {{ client }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
