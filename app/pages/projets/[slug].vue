<script setup lang="ts">
import { projects } from '~/data/projects'

const { t } = useI18n()
const route = useRoute()
const project = computed(() =>
  projects.find(p => p.slug === route.params.slug)
)

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Projet non trouvé' })
}

const coverSrc = project.value.images.find(i => i.cover)?.src || project.value.images[0]?.src

useSeo({
  title: `${project.value.title} — Emeric Guyon`,
  description: t(`projects.items.${project.value.slug}.description`),
  image: coverSrc,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        'name': project.value.title,
        'description': t(`projects.items.${project.value.slug}.description`),
        'image': coverSrc ? `https://emericguyon.com${coverSrc}` : undefined,
        'url': project.value.url || `https://emericguyon.com/projets/${project.value.slug}`,
        'author': {
          '@type': 'Person',
          'name': 'Emeric Guyon',
          'url': 'https://emericguyon.com',
        },
        'keywords': project.value.technologies.join(', '),
      }),
    },
  ],
})
</script>

<template>
  <div v-if="project">
    <ProjectDetail :project="project" />
    <div class="mt-20 lg:mt-32" />
    <AppContact />
  </div>
</template>
