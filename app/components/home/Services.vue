<script setup lang="ts">
import { SERVICE_COLORS } from '~/lib/colors'

const { t } = useI18n()
const { letterReveal, wordReveal, servicesReveal } = useScrollAnimation()

// Label — word by word reveal
letterReveal('.services-label')

// Title — word by word reveal
wordReveal('.services-title', 0.2)

// Cards + icons timeline
servicesReveal('.services-grid')

const services = Object.keys(SERVICE_COLORS).map(key => ({ key, color: SERVICE_COLORS[key] }))
</script>

<template>
  <section id="services" class="relative py-20 lg:py-32">
    <div class="section-glow left-1/3 top-1/4 bg-accent-amber" />

    <div class="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
      <div class="mb-16 max-w-xl">
        <span class="section-label services-label">{{ t('services.label') }}</span>
        <h2 class="section-title services-title mt-4">
          {{ t('services.title') }}
        </h2>
      </div>

      <div class="services-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="service in services"
          :key="service.key"
          class="service-card flex flex-col items-center rounded-2xl border border-border bg-surface px-8 py-12 text-center"
        >
          <!-- Icon -->
          <div class="service-icon mb-6 flex h-16 w-16 items-center justify-center">
            <IconsCode v-if="service.key === 'custom'" class="h-8 w-8" :class="service.color" />
            <IconsRefresh v-else-if="service.key === 'redesign'" class="h-8 w-8" :class="service.color" />
            <IconsBolt v-else-if="service.key === 'performance'" class="h-8 w-8" :class="service.color" />
            <IconsBook v-else-if="service.key === 'consulting'" class="h-8 w-8" :class="service.color" />
            <IconsBrain v-else-if="service.key === 'ai'" class="h-8 w-8" :class="service.color" />
            <IconsUsers v-else-if="service.key === 'team'" class="h-8 w-8" :class="service.color" />
          </div>

          <div class="service-text">
            <h3 class="mb-3 font-display text-lg font-semibold text-foreground">
              {{ t(`services.items.${service.key}.title`) }}
            </h3>
            <p class="text-sm leading-relaxed text-muted-foreground">
              {{ t(`services.items.${service.key}.desc`) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
