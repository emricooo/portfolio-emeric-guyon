<script setup lang="ts">
import type { Project } from '~/types'

const props = defineProps<{ project: Project }>()

const { t, te } = useI18n()
const router = useRouter()

const allImages = computed(() => props.project.images)

function goBack() {
  if (window.history.length > 1) {
    router.back()
  }
  else {
    navigateTo('/#projects')
  }
}

// Per-project i18n key existence checks (sections are skipped when empty)
const i18nKey = (suffix: string) => `projects.items.${props.project.slug}.${suffix}`

const hasContextText = computed(() => te(i18nKey('longDescription')))
const hasApproachText = computed(() => te(i18nKey('approach')))
const hasResultText = computed(() => te(i18nKey('result')))
const hasStackNote = computed(() => te(i18nKey('stackNote')))

// Existing takeaways (used as bullets inside "Mon approche" if no `approach` key)
const takeaways = computed(() =>
  props.project.takeawaysCount
    ? Array.from({ length: props.project.takeawaysCount }, (_, i) => t(i18nKey(`takeaway${i + 1}`)))
    : [],
)
const hasApproachContent = computed(() => hasApproachText.value || takeaways.value.length > 0)
</script>

<template>
  <article class="project-header-wrapper">
    <!-- Top bar: back button -->
    <button
      class="nav-link group/back relative mb-8 inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      @click="goBack"
    >
      <IconsArrowLeft class="h-4.5 w-4.5 transition-transform duration-300 group-hover/back:-translate-x-1" />
      {{ t('projects.back') }}
    </button>

    <!-- Header: title -->
    <header class="mb-10 max-w-4xl">
      <h1 class="font-display text-4xl font-bold leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
        {{ project.title }}
      </h1>

      <!-- Metadata bar -->
      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <!-- Tech tags -->
        <div class="flex flex-wrap gap-2">
          <Badge v-for="tech in project.technologies" :key="tech">
            {{ tech }}
          </Badge>
        </div>
        <!-- Agency -->
        <span v-if="project.agency" class="text-muted-foreground">
          {{ t('projects.madeWithAgency') }}
          <a
            :href="project.agency.url"
            target="_blank"
            rel="noopener"
            class="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
          >
            {{ project.agency.name }}
          </a>
        </span>
        <!-- Live link -->
        <a
          v-if="project.url"
          :href="project.url"
          target="_blank"
          rel="noopener"
          class="ml-auto inline-flex items-center gap-1.5 text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          {{ t('projects.viewSite') }} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>

    <!-- Main 2-col layout — both columns scroll naturally, no sticky -->
    <div class="project-layout">
      <!-- IMAGES (left on desktop, bottom on mobile via flex order) -->
      <div class="project-images space-y-6">
        <div
          v-for="(img, idx) in allImages"
          :key="idx"
          class="overflow-hidden rounded-xl shadow-sm ring-1 ring-foreground/5"
        >
          <NuxtImg
            :src="img.src"
            sizes="sm:100vw md:50vw lg:600px"
            :alt="`${project.title} — ${idx + 1}`"
            width="640"
            height="480"
            loading="lazy"
            class="block w-full"
          />
        </div>
      </div>

      <!-- TEXT (right on desktop, top on mobile) -->
      <div class="project-text space-y-12 lg:space-y-14">
        <!-- 01 — Contexte -->
        <section v-if="hasContextText">
          <div class="project-section-num font-mono text-xs tracking-[0.3em]" :style="{ color: project.accentColor ?? 'var(--color-primary)' }">
            01
          </div>
          <h2 class="mt-2 font-display text-2xl font-bold leading-tight text-foreground lg:text-3xl">
            {{ t('projects.contextLabel') }}
          </h2>
          <div class="mt-3 h-px w-12" :style="{ background: project.accentColor ?? 'var(--color-primary)' }" />
          <p class="mt-6 text-base leading-relaxed text-foreground/85 lg:text-[17px]">
            {{ t(i18nKey('longDescription')) }}
          </p>
        </section>

        <!-- 02 — Mon approche -->
        <section v-if="hasApproachContent">
          <div class="project-section-num font-mono text-xs tracking-[0.3em]" :style="{ color: project.accentColor ?? 'var(--color-primary)' }">
            02
          </div>
          <h2 class="mt-2 font-display text-2xl font-bold leading-tight text-foreground lg:text-3xl">
            {{ t('projects.approachLabel') }}
          </h2>
          <div class="mt-3 h-px w-12" :style="{ background: project.accentColor ?? 'var(--color-primary)' }" />
          <p v-if="hasApproachText" class="mt-6 text-base leading-relaxed text-foreground/85 lg:text-[17px]">
            {{ t(i18nKey('approach')) }}
          </p>
          <ul v-if="takeaways.length" class="mt-6 space-y-2.5">
            <li v-for="(item, i) in takeaways" :key="i" class="flex items-start gap-3 text-base leading-relaxed text-foreground/85 lg:text-[17px]">
              <span class="mt-2.5 h-1 w-1 shrink-0 rounded-full" :style="{ background: project.accentColor ?? 'var(--color-primary)' }" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <!-- 03 — Stack & choix techniques -->
        <section>
          <div class="project-section-num font-mono text-xs tracking-[0.3em]" :style="{ color: project.accentColor ?? 'var(--color-primary)' }">
            03
          </div>
          <h2 class="mt-2 font-display text-2xl font-bold leading-tight text-foreground lg:text-3xl">
            {{ t('projects.stackLabel') }}
          </h2>
          <div class="mt-3 h-px w-12" :style="{ background: project.accentColor ?? 'var(--color-primary)' }" />
          <p v-if="hasStackNote" class="mt-6 text-base leading-relaxed text-foreground/85 lg:text-[17px]">
            {{ t(i18nKey('stackNote')) }}
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <Badge v-for="tech in project.technologies" :key="tech">
              {{ tech }}
            </Badge>
          </div>
        </section>

        <!-- 04 — Résultat & apprentissages -->
        <section v-if="hasResultText">
          <div class="project-section-num font-mono text-xs tracking-[0.3em]" :style="{ color: project.accentColor ?? 'var(--color-primary)' }">
            04
          </div>
          <h2 class="mt-2 font-display text-2xl font-bold leading-tight text-foreground lg:text-3xl">
            {{ t('projects.resultLabel') }}
          </h2>
          <div class="mt-3 h-px w-12" :style="{ background: project.accentColor ?? 'var(--color-primary)' }" />
          <p class="mt-6 text-base leading-relaxed text-foreground/85 lg:text-[17px]">
            {{ t(i18nKey('result')) }}
          </p>
        </section>
      </div>
    </div>

    <!-- Footer nav -->
    <ProjectFooterNav :slug="project.slug" />
  </article>
</template>
