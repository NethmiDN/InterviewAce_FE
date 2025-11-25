# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Design Palette

This project defines an extended Tailwind color palette oriented around deep navy → light cyan gradients. Naming follows `colorName` plus numeric shade tokens (100 darkest → 900 lightest). Use guidelines:

- Backgrounds: Prefer `smart_blue-100..500`, `sapphire-100..500`, `regal_navy-100..500`, or the prussian variants (`prussian_blue-400..600`) for primary sections. For the darkest hero/banner, use `prussian_blue_deep-100`.
- Surface panels / cards: Step up 1–2 shades: e.g. a page background `regal_navy-400` with cards `regal_navy-600` shadows and borders using `twilight_indigo-300`.
- Text (light on dark): Use high shades (700–900) of the same family for subtle harmony; e.g. `text-smart_blue-900`. Neutral copy can use `lavender_grey-800/900` or `slate_grey-800` for softer contrast.
- Text (dark on light backgrounds): When on very light cyan / light neutrals, switch to mid-dark (400–600) or default of the family.
- Accents / Links: Choose brighter mid tones `smart_blue-600`, `sapphire-600`, `prussian_blue-600`, `brandText` (#a9d6e5) for a softer highlight.
- Borders: Use a mid shade (300–400) darker than the panel fill.
- Disabled states: Desaturate with neutral `blue_slate-400` or `slate_grey-400`.

### Prussian Variants
Original data set contained multiple `prussian_blue` entries. They have been mapped:

- `prussian_blue`: Base (#002855)
- `prussian_blue_alt`: Alternate (#001845) slightly lighter
- `prussian_blue_deep`: Deep (#001233) darkest/navy core

### Example Usage

```tsx
<div className="bg-prussian_blue_deep-100 text-lavender_grey-900 p-6">
  <h1 className="text-brandText text-3xl font-semibold">InterviewAce</h1>
  <p className="text-smart_blue-800">Sharpen your interview prep.</p>
  <button className="mt-4 bg-smart_blue-500 hover:bg-smart_blue-600 text-light_cyan-900 px-4 py-2 rounded">Get Started</button>
</div>
```

### Utility Cheatsheet

- Hero background: `bg-prussian_blue_deep-100`
- Primary section: `bg-regal_navy-400`
- Card surface: `bg-twilight_indigo-500`
- Primary text (on dark): `text-lavender_grey-900`
- Secondary text (on dark): `text-blue_slate-800`
- Muted text: `text-slate_grey-600`
- Divider line: `border-twilight_indigo-300`
- Link: `text-smart_blue-600 hover:text-smart_blue-700`
- Accent soft highlight: `text-brandText`

Keep contrast ratios accessible (aim ≥ 4.5:1 for body text). When in doubt, test combos with a contrast checker.

### Gradient Background Utilities

Custom gradient classes (via `backgroundImage` extension):

- `bg-gradient-navy`: Vertical deep navy transition (#001233 → #002855 → #023e7d). Use for full-page backgrounds.
- `bg-gradient-royal`: Radial focus glow (smart_blue center fading to deep navy). Good for hero sections.
- `bg-gradient-header`: Horizontal banding ideal for top nav / headers.
- `bg-gradient-dusk`: Subtle diagonal blend for secondary panels.
- `bg-gradient-panel`: Corner-emphasis gradient for cards or modals.

Example layout wrapper:
```tsx
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gradient-navy text-lavender_grey-900">
    <header className="bg-gradient-header p-4 shadow-md">
      <h1 className="text-brandText text-2xl font-semibold">InterviewAce</h1>
    </header>
    <main className="px-6 py-8 space-y-8">
      {children}
    </main>
    <footer className="bg-prussian_blue_deep-100/80 backdrop-blur-sm p-4 text-sm text-blue_slate-800">
      © {new Date().getFullYear()} InterviewAce
    </footer>
  </div>
)
```

Accessibility tip: Avoid placing long-form text directly over the mid-transition region of a gradient; instead provide a solid overlay (`bg-prussian_blue-500/70 backdrop-blur-sm`) when necessary.

