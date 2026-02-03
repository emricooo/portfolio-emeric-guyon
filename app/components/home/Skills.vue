<script setup lang="ts">
import { skills } from '~/data/skills'

const { t } = useI18n()
const { letterReveal, wordReveal, staggerReveal, skillsReveal } = useScrollAnimation()

const hoveredSkill = ref<string | null>(null)

// Animations
letterReveal('.skills-label')
wordReveal('.skills-title', 0.2)
staggerReveal('.skill-name', 0.04)
skillsReveal('.skills-content')

// Split logos into: first 3, middle rows of 5, last 3
const firstRow = computed(() => skills.slice(0, 3))
const middleRows = computed(() => skills.slice(3, skills.length - 3))
const lastRow = computed(() => skills.slice(skills.length - 3))
</script>

<template>
  <section id="skills" class="relative py-20 lg:py-32">
    <div class="section-glow right-1/4 top-1/3 bg-accent-magenta" />

    <div class="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
      <!-- Content: Left (header + names) + Logos right -->
      <div class="skills-content flex flex-col gap-12 sm:flex-row sm:items-center sm:gap-12 lg:gap-20">
        <!-- Left: Header + 4-column name grid -->
        <div class="flex-1">
          <div class="mb-10 max-w-xl">
            <span class="section-label skills-label">{{ t('skills.label') }}</span>
            <h2 class="section-title skills-title mt-4">
              {{ t('skills.title') }}
            </h2>
          </div>
          <div class="skills-names columns-2 gap-x-8 nav:columns-3 lg:columns-4">
            <span
              v-for="skill in skills"
              :key="skill.name"
              class="skill-name mb-2 block break-inside-avoid cursor-default text-sm text-foreground transition-colors duration-300 md:text-base"
              :class="[skill.highlighted ? 'text-primary!' : '']"
              @mouseenter="hoveredSkill = skill.name"
              @mouseleave="hoveredSkill = null"
            >
              <span
                class="skill-name-text relative"
                :class="hoveredSkill === skill.name ? 'skill-name--active' : ''"
              >{{ skill.name }}</span>
            </span>
          </div>
        </div>

        <!-- Right: Logo grid (3 / 5×n / 3) -->
        <div class="skills-icons hidden flex-col items-center sm:flex" :class="{ 'has-hover': hoveredSkill }">
          <!-- First row: 3 logos centered -->
          <div class="flex">
            <div
              v-for="skill in firstRow"
              :key="skill.name"
              class="skill-icon flex h-12 w-12 items-center justify-center md:h-14 md:w-14"
              :data-skill="skill.name"
              @mouseenter="hoveredSkill = skill.name"
              @mouseleave="hoveredSkill = null"
            >
              <img
                :src="skill.logo"
                :alt="skill.name"
                class="skill-logo h-8 w-8 object-contain md:h-10 md:w-10"
                :class="hoveredSkill === skill.name ? 'skill-logo--active' : ''"
              >
            </div>
          </div>
          <!-- Middle rows: 5 per row -->
          <div class="flex flex-wrap justify-center" :style="{ maxWidth: `${5 * 56}px` }">
            <div
              v-for="skill in middleRows"
              :key="skill.name"
              class="skill-icon flex h-12 w-12 items-center justify-center md:h-14 md:w-14"
              :data-skill="skill.name"
              @mouseenter="hoveredSkill = skill.name"
              @mouseleave="hoveredSkill = null"
            >
              <img
                :src="skill.logo"
                :alt="skill.name"
                class="skill-logo h-8 w-8 object-contain md:h-10 md:w-10"
                :class="hoveredSkill === skill.name ? 'skill-logo--active' : ''"
              >
            </div>
          </div>
          <!-- Last row: 3 logos centered -->
          <div class="flex">
            <div
              v-for="skill in lastRow"
              :key="skill.name"
              class="skill-icon flex h-12 w-12 items-center justify-center md:h-14 md:w-14"
              :data-skill="skill.name"
              @mouseenter="hoveredSkill = skill.name"
              @mouseleave="hoveredSkill = null"
            >
              <img
                :src="skill.logo"
                :alt="skill.name"
                class="skill-logo h-8 w-8 object-contain md:h-10 md:w-10"
                :class="hoveredSkill === skill.name ? 'skill-logo--active' : ''"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
