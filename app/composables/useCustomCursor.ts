import { gsap } from 'gsap'

export function useCustomCursor() {
  const cursorEl = ref<HTMLElement | null>(null)
  const cursorLabelEl = ref<HTMLElement | null>(null)
  const isTouch = ref(false)
  const listeners: Array<{ event: string, handler: EventListener }> = []

  function addDocListener(event: string, handler: EventListener) {
    document.addEventListener(event, handler)
    listeners.push({ event, handler })
  }

  function init() {
    if (typeof window === 'undefined') return
    isTouch.value = 'ontouchstart' in window
    if (isTouch.value) return

    // Create cursor elements
    const cursor = document.createElement('div')
    cursor.classList.add('custom-cursor')
    document.body.appendChild(cursor)
    cursorEl.value = cursor

    const label = document.createElement('div')
    label.classList.add('custom-cursor-label')
    document.body.appendChild(label)
    cursorLabelEl.value = label

    // Follow mouse with GSAP for smoothness
    addDocListener('mousemove', (e) => {
      const { clientX, clientY } = e as MouseEvent
      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: true,
      })
      gsap.to(label, {
        x: clientX,
        y: clientY,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: true,
      })
    })

    // Set up hover detection
    setupHoverListeners()
  }

  function setupHoverListeners() {
    const interactiveSelectors = 'a, button, [data-cursor-hover]'
    const projectSelectors = '[data-cursor-project]'

    addDocListener('mouseover', (e) => {
      const target = (e as MouseEvent).target as HTMLElement

      const projectEl = target.closest(projectSelectors)
      if (projectEl) {
        cursorEl.value?.classList.add('hovering-project')
        cursorEl.value?.classList.remove('hovering')
        const cursorText = projectEl.getAttribute('data-cursor-text') || 'Voir'
        if (cursorLabelEl.value) {
          cursorLabelEl.value.textContent = cursorText
          cursorLabelEl.value.classList.add('visible')
        }
        return
      }

      const interactiveEl = target.closest(interactiveSelectors)
      if (interactiveEl) {
        cursorEl.value?.classList.add('hovering')
        cursorEl.value?.classList.remove('hovering-project')
        if (cursorLabelEl.value) {
          cursorLabelEl.value.classList.remove('visible')
        }
      }
    })

    addDocListener('mouseout', (e) => {
      const target = (e as MouseEvent).target as HTMLElement
      const relatedTarget = (e as MouseEvent).relatedTarget as HTMLElement | null

      if (target.closest(projectSelectors) && !relatedTarget?.closest(projectSelectors)) {
        cursorEl.value?.classList.remove('hovering-project')
        if (cursorLabelEl.value) {
          cursorLabelEl.value.classList.remove('visible')
        }
      }

      if (target.closest(interactiveSelectors) && !relatedTarget?.closest(interactiveSelectors)) {
        cursorEl.value?.classList.remove('hovering')
      }
    })
  }

  function destroy() {
    listeners.forEach(({ event, handler }) => document.removeEventListener(event, handler))
    listeners.length = 0
    cursorEl.value?.remove()
    cursorLabelEl.value?.remove()
  }

  return { init, destroy, isTouch }
}
