<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '~/types'

const props = defineProps<{ project: Project }>()
const { t, te } = useI18n()

const cover = computed(() => {
  if (props.project.heroImage) return { src: props.project.heroImage }
  return props.project.images.find(i => i.cover) ?? props.project.images[0]
})

const heroEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const metaEl = ref<HTMLElement | null>(null)

const accent = computed(() => props.project.accentColor ?? 'var(--color-primary)')

const roleKey = computed(() => `projects.items.${props.project.slug}.role`)
const roleText = computed(() => (te(roleKey.value) ? t(roleKey.value) : ''))

let triggers: ScrollTrigger[] = []
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!heroEl.value) return
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Image parallax + scale-down on scroll
    const img = heroEl.value!.querySelector('.project-hero-img') as HTMLElement | null
    if (img) {
      const t1 = gsap.to(img, {
        yPercent: 12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      if (t1.scrollTrigger) triggers.push(t1.scrollTrigger)
    }

    // Title pulls up + fades on scroll
    if (titleEl.value) {
      const t2 = gsap.to(titleEl.value, {
        yPercent: -40,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroEl.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      if (t2.scrollTrigger) triggers.push(t2.scrollTrigger)
    }

    // Entry: title slides up word-by-word, meta fades in
    if (titleEl.value) {
      gsap.from(titleEl.value, {
        yPercent: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    }
    if (metaEl.value) {
      gsap.from(metaEl.value, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
      })
    }
  }, heroEl.value)
})

onUnmounted(() => {
  triggers.forEach(t => t.kill())
  triggers = []
  ctx?.revert()
})
</script>

<template>
  <section
    ref="heroEl"
    class="project-hero"
    :style="{ '--project-accent': accent }"
  >
    <div class="project-hero-image-wrap">
      <NuxtImg
        v-if="cover"
        :src="cover.src"
        :alt="t('projects.imageAlt', { project: project.title, n: 1, tech: project.technologies.slice(0, 2).join(', ') })"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw 2xl:100vw"
        width="2400"
        height="1266"
        loading="eager"
        fetchpriority="high"
        class="project-hero-img"
      />
      <div class="project-hero-overlay" aria-hidden="true" />
    </div>

    <div class="project-hero-content">
      <div class="project-hero-meta-top" aria-hidden="true">
        <span class="project-hero-rule" :style="{ background: accent }" />
        <span class="project-hero-tag">{{ project.year ?? '' }}</span>
        <span v-if="project.role || roleText" class="project-hero-tag">{{ roleText || project.role }}</span>
      </div>

      <h1 ref="titleEl" class="project-hero-title text-balance">
        {{ project.title }}
      </h1>

      <div ref="metaEl" class="project-hero-bottom">
        <div class="project-hero-tags">
          <Badge v-for="tech in project.technologies" :key="tech">{{ tech }}</Badge>
        </div>
        <a
          v-if="project.url"
          :href="project.url"
          target="_blank"
          rel="noopener"
          data-cursor-hover
          class="project-hero-cta"
        >
          <span>{{ t('projects.viewSite') }}</span>
          <IconsArrowTopRight aria-hidden="true" class="ml-1 h-3.5 w-3.5 shrink-0" />
        </a>
      </div>
    </div>

    <div class="project-hero-scroll-cue" aria-hidden="true">
      <span class="project-hero-scroll-line" />
    </div>
  </section>
</template>
