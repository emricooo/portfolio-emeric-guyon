<script setup lang="ts">
const { init: initCursor, destroy: destroyCursor } = useCustomCursor()
const { init: initTheme } = useTheme()
const { start: startColorCycle, stop: stopColorCycle } = useColorCycle()

onMounted(() => {
  initCursor()
  initTheme()
  startColorCycle()

  // Remove loading state after a tick so GSAP can set initial states
  nextTick(() => {
    document.documentElement.style.opacity = '1'
    document.documentElement.classList.remove('app-loading')
  })
})

onUnmounted(() => {
  destroyCursor()
  stopColorCycle()
})
</script>

<template>
  <div class="grain min-h-screen bg-background font-sans text-foreground">
    <AppNavigation />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
