<script setup lang="ts">
import { projects } from '~/data/projects'

const props = defineProps<{ slug: string }>()
const { t } = useI18n()

// Use featured projects (matches the cinema strip ordering)
const featured = computed(() => projects.filter(p => p.featured))
const currentIdx = computed(() => featured.value.findIndex(p => p.slug === props.slug))

const prev = computed(() => {
  const idx = currentIdx.value
  return idx > 0 ? featured.value[idx - 1] : null
})
const next = computed(() => {
  const idx = currentIdx.value
  return idx >= 0 && idx < featured.value.length - 1 ? featured.value[idx + 1] : null
})
</script>

<template>
  <nav class="project-footer-nav border-t border-border mt-16 pt-8 lg:mt-24 lg:pt-12">
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <!-- Previous (newer in time) -->
      <NuxtLink
        v-if="prev"
        :to="`/projets/${prev.slug}`"
        class="group/prev flex flex-col gap-1 sm:items-start"
      >
        <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover/prev:text-foreground">
          ← {{ t('projects.previous') }}
        </span>
        <span
          class="font-display text-2xl font-bold text-foreground transition-colors lg:text-3xl"
          :style="prev.accentColor ? `--hover-color: ${prev.accentColor}` : undefined"
        >
          {{ prev.title }}
        </span>
      </NuxtLink>
      <NuxtLink
        v-else
        to="/#projects"
        class="group/back flex flex-col gap-1 sm:items-start"
      >
        <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover/back:text-foreground">
          ←
        </span>
        <span class="font-display text-2xl font-bold text-foreground transition-colors lg:text-3xl">
          {{ t('projects.allProjects') }}
        </span>
      </NuxtLink>

      <!-- Next (older in time) -->
      <NuxtLink
        v-if="next"
        :to="`/projets/${next.slug}`"
        class="group/next flex flex-col gap-1 sm:items-end sm:text-right"
      >
        <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover/next:text-foreground">
          {{ t('projects.next') }} →
        </span>
        <span class="font-display text-2xl font-bold text-foreground transition-colors lg:text-3xl">
          {{ next.title }}
        </span>
      </NuxtLink>
      <NuxtLink
        v-else
        to="/#projects"
        class="group/back flex flex-col gap-1 sm:items-end sm:text-right"
      >
        <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover/back:text-foreground">
          →
        </span>
        <span class="font-display text-2xl font-bold text-foreground transition-colors lg:text-3xl">
          {{ t('projects.allProjects') }}
        </span>
      </NuxtLink>
    </div>
  </nav>
</template>
