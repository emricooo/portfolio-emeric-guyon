<script setup lang="ts">
import { projects } from '~/data/projects'

const { t } = useI18n()
const { letterReveal, wordReveal, projectsReveal } = useScrollAnimation()

const featuredProjects = computed(() => projects.filter(p => p.featured))

// Split into alternating groups: 1 hero, 4 grid, 1 hero, 4 grid...
const projectGroups = computed(() => {
  const groups: { type: 'hero' | 'grid'; projects: typeof featuredProjects.value }[] = []
  let i = 0
  const list = featuredProjects.value
  while (i < list.length) {
    groups.push({ type: 'hero', projects: [list[i]!] })
    i++
    if (i < list.length) {
      groups.push({ type: 'grid', projects: list.slice(i, i + 4) })
      i += 4
    }
  }
  return groups
})

function coverSrc(p: typeof featuredProjects.value[0]) {
  return p.images.find(i => i.cover)?.src ?? p.images[0]!.src
}

// Animations
letterReveal('.projects-label')
wordReveal('.projects-title', 0.2)
projectsReveal('.projects-content')
</script>

<template>
  <section id="projects" class="relative py-20 lg:py-32">
    <div class="projects-content relative z-10 mx-auto max-w-7xl px-4 md:px-8">
      <div class="mb-16">
        <span class="section-label projects-label">{{ t('projects.label') }}</span>
        <h2 class="section-title projects-title mt-4">
          {{ t('projects.title') }}
        </h2>
      </div>

      <div class="space-y-8">
        <template v-for="(group, gi) in projectGroups" :key="gi">
          <!-- Hero: full width -->
          <NuxtLink
            v-if="group.type === 'hero'"
            :to="`/projets/${group.projects[0]!.slug}`"
            class="project-hero group relative block overflow-hidden rounded-2xl"
            data-cursor-project
            :data-cursor-text="t('projects.view')"
          >
            <NuxtImg
              :src="coverSrc(group.projects[0]!)"
              sizes="sm:100vw md:1200px"
              :alt="group.projects[0]!.title"
              width="1200"
              height="514"
              :loading="gi === 0 ? undefined : 'lazy'"
              :fetchpriority="gi === 0 ? 'high' : undefined"
              class="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-21/9"
            />
            <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div class="project-hero-content absolute bottom-0 left-0 p-6 md:p-12">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in group.projects[0]!.technologies"
                  :key="tech"
                  class="project-hero-tag rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] text-white/80 sm:px-3 sm:py-1 sm:text-xs"
                >
                  {{ tech }}
                </span>
              </div>
              <h3 class="project-hero-title mt-2 font-display text-xl font-bold text-white sm:mt-3 sm:text-3xl md:text-5xl">
                {{ group.projects[0]!.title }}
              </h3>
              <p class="project-hero-desc mt-1 text-xs text-white/60 sm:mt-2 sm:max-w-lg sm:text-sm sm:text-white/70">{{ t(`projects.items.${group.projects[0]!.slug}.description`) }}</p>
            </div>
          </NuxtLink>

          <!-- Grid: 2 columns -->
          <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <NuxtLink
              v-for="project in group.projects"
              :key="project.slug"
              :to="`/projets/${project.slug}`"
              class="project-card group relative overflow-hidden rounded-2xl"
              data-cursor-project
              :data-cursor-text="t('projects.view')"
            >
              <NuxtImg
                :src="coverSrc(project)"
                sizes="sm:100vw md:600px"
                :alt="project.title"
                width="600"
                height="450"
                loading="lazy"
                class="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div class="project-card-content absolute bottom-0 left-0 p-6">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="project-card-tag rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] text-white/80"
                  >
                    {{ tech }}
                  </span>
                </div>
                <h3 class="project-card-title mt-2 font-display text-xl font-bold text-white md:text-2xl">
                  {{ project.title }}
                </h3>
                <p class="project-card-desc mt-1 text-xs text-white/60">{{ t(`projects.items.${project.slug}.description`) }}</p>
              </div>
            </NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
