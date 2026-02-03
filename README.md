<div align="center">

# emericguyon.com

**Freelance Fullstack Developer Portfolio**

Dark theme | Bilingual FR/EN | GSAP Animations

[![Live](https://img.shields.io/badge/Live-emericguyon.com-000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://emericguyon.com)

![Portfolio Preview](preview.png)

</div>

---

## Tech Stack

<div align="center">

![Nuxt](https://img.shields.io/badge/Nuxt_3-00DC82?style=for-the-badge&logo=nuxtdotjs&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue_3-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)

</div>

## Features

- **Canvas Hero** — custom code rain effect with spotlight reveal on hover
- **Scroll Animations** — word reveal, letter reveal, fade-in via GSAP ScrollTrigger
- **Dark / Light Theme** — toggle with smooth transitions, persisted via cookie
- **Bilingual** — French (default) + English with `/en/` prefix
- **Responsive** — optimized for mobile, tablet and desktop
- **Performance** — lazy-loaded sections, FPS-capped canvas, reduced-motion support

## Getting Started

```bash
npm install
npm run dev
```

Dev server runs on `http://localhost:3000`.

## Build

```bash
npm run build     # SSR build
npm run generate  # Static generation
```

## Project Structure

```
app/
  components/
    home/        # Hero, About, Services, Skills, Projects, Clients
    project/     # ProjectDetail
    icons/       # SVG icon components
    ui/          # Badge, ThemeToggle
    App*.vue     # AppNavigation, AppFooter, AppContact, AppPageTransition
  composables/   # useScrollAnimation, useTheme, useSeo, useCustomCursor
  pages/         # index, projets/[slug]
  data/          # Projects, skills, clients, hero code
i18n/locales/    # fr.json, en.json
public/          # Images, fonts, favicon
```

## License

[MIT](LICENSE)
