<script setup lang="ts">
import type { Project } from '~/types'

const props = defineProps<{ project: Project }>()

const { t } = useI18n()
const router = useRouter()

const nonCoverImages = computed(() => props.project.images.filter(i => !i.cover))
const hasNonCoverImages = computed(() => nonCoverImages.value.length > 0)
const coverImage = computed(() => props.project.images.find(i => i.cover))
const sidebarImages = computed(() => hasNonCoverImages.value ? nonCoverImages.value : props.project.images)

function goBack() {
  if (window.history.length > 1) {
    router.back()
  }
  else {
    navigateTo('/#projects')
  }
}
</script>

<template>
  <div class="project-header-wrapper">
    <button class="nav-link group relative mb-8 inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground" @click="goBack">
      <IconsArrowLeft class="h-4.5 w-4.5 transition-transform duration-300 group-hover:-translate-x-1" />
      {{ t('projects.back') }}
    </button>

    <div class="project-layout">
      <!-- 1st in source: text (mobile: top, desktop: right via order) -->
      <div class="project-text">
        <div class="space-y-4">
          <h1 class="font-display text-4xl font-bold text-foreground md:text-5xl">
            {{ project.title }}
          </h1>
          <p class="text-base leading-relaxed text-muted-foreground">
            {{ t(`projects.items.${project.slug}.longDescription`) }}
          </p>
          <ul v-if="project.takeawaysCount" class="space-y-1.5">
            <li
              v-for="i in project.takeawaysCount"
              :key="i"
              class="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {{ t(`projects.items.${project.slug}.takeaway${i}`) }}
            </li>
          </ul>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="tech in project.technologies" :key="tech">
              {{ tech }}
            </Badge>
          </div>
          <p v-if="project.agency" class="text-sm text-muted-foreground">
            {{ t('projects.madeWith') }}
            <a
              :href="project.agency.url"
              target="_blank"
              rel="noopener"
              class="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              {{ project.agency.name }}
            </a>
          </p>
          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener"
            class="inline-block text-sm text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            {{ t('projects.viewSite') }} &nearr;
          </a>
        </div>
      </div>

      <!-- 2nd in source: images (mobile: bottom, desktop: left via order) -->
      <div class="project-images">
        <div
          v-for="(img, idx) in sidebarImages"
          :key="idx"
          class="overflow-hidden rounded-xl shadow-sm ring-1 ring-foreground/5"
          :style="idx > 0 ? 'margin-top: 1.5rem;' : ''"
        >
          <NuxtImg
            :src="img.src"
            sizes="sm:100vw md:640px"
            :alt="`${project.title} — ${idx + 1}`"
            width="640"
            height="480"
            loading="lazy"
            style="width: 100%; display: block; border-radius: 0.75rem;"
          />
        </div>
      </div>
    </div>

    <!-- Cover image — only if there are other images in the left column -->
    <div v-if="coverImage && hasNonCoverImages" class="mt-8 overflow-hidden rounded-xl shadow-sm ring-1 ring-foreground/5">
      <NuxtImg
        :src="coverImage.src"
        sizes="sm:100vw md:1200px"
        :alt="project.title"
        width="1280"
        height="640"
        loading="lazy"
        class="w-full rounded-xl"
      />
    </div>
  </div>
</template>
