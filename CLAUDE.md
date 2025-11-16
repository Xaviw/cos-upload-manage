# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React + TypeScript frontend application** for a **COS (Cloud Object Storage) File Upload Management System**. It's a Chinese-language web interface for managing file uploads to cloud storage with user authentication and management features.

**Technology Stack:**

- React 19.2.0 with TypeScript 5.9.3
- Vite 7.2.2 for build tooling
- TailwindCSS 4.1.17 for styling
- Shadcn/ui component library (@radix-ui primitives)
- React Router 7.9.6 for routing
- PNPM for package management

## Common Commands

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check formatting without changes
pnpm format:check
```

## High-Level Architecture

### Core Structure

```
src/
├── app.tsx              # App entry point, routing configuration
├── App.tsx              # Main app component
├── global.css           # Global styles, Tailwind, CSS variables
├── components/
│   ├── ui/              # Reusable UI components (Shadcn/ui)
│   │   ├── button.tsx   # Button with variants
│   │   ├── input.tsx    # Input component
│   │   └── badge.tsx    # Badge component
│   └── Header.tsx       # Main navigation header
├── layouts/
│   └── MainLayout.tsx   # Application layout wrapper
├── pages/
│   ├── Home.tsx         # Home page (/)
│   ├── Login.tsx        # Login page (/login)
│   └── signup.tsx       # Signup page (/signup)
├── lib/
│   └── utils.ts         # Utility functions (cn helper for classNames)
└── hooks/               # Custom React hooks (currently empty)
```

### Application Flow

1. **Entry Point** (`src/app.tsx`):
   - Sets up React root and BrowserRouter
   - Defines route structure: `/` (Home), `/login`, `/signup`
   - Home route wrapped with MainLayout

2. **Routing**:
   - React Router v7 configured in `src/app.tsx`
   - Header navigation includes: 首页 (Home), 上传记录 (Upload Records), 用户管理 (User Management)
   - Some routes referenced in navigation (`/records`, `/users`) are not yet implemented

3. **Component Architecture**:
   - Layout pattern: MainLayout wraps page content
   - Reusable UI components in `src/components/ui/` following Shadcn/ui patterns
   - Custom styling with TailwindCSS 4 using CSS custom properties
   - Dark mode support via `.dark` class on root element

### Configuration Files

- **vite.config.ts**: Vite configuration with React plugin, TailwindCSS integration, and path alias `@/` → `src/`
- **tsconfig.json**: TypeScript project references (app + node configs)
- **tsconfig.app.json**: Frontend TypeScript configuration (strict mode, path aliases)
- **tsconfig.node.json**: Build-time TypeScript configuration
- **eslint.config.js**: Flat config format with TypeScript, React, and Prettier integration
- **components.json**: Shadcn/ui configuration (New York style, Lucide icons, TailwindCSS)
- **.env**: Contains `VITE_APP_TITLE=COS文件上传管理系统` (Chinese title)

## Development Notes

### Current State

**Early Development Stage** - The project is a foundation with:

- ✅ Basic routing structure
- ✅ Authentication page scaffolding (Login/Signup)
- ✅ UI component library (Shadcn/ui) set up
- ✅ TailwindCSS with dark mode support
- ❌ Empty directories: `src/assets/`, `src/hooks/`
- ❌ Minimal implementation: Home page only shows "home" text
- ❌ No actual COS integration or file upload logic
- ❌ No API/backend connection
- ❌ No authentication logic implementation
- ❌ No test framework configured
- ❌ Missing route implementations: `/records`, `/users`

### Code Quality Tools

- **ESLint**: TypeScript-aware linting with React hooks rules
- **Prettier**: Code formatting with configured .prettierrc
- **TypeScript**: Strict type checking enabled
- VS Code extensions recommended: Prettier, Tailwind CSS IntelliSense, ESLint

### Styling System

- TailwindCSS 4 with new `@import` approach
- CSS custom properties for theming (light/dark mode)
- Oklch color space for colors
- Custom design tokens (radius, colors) in global.css
- Component variants using class-variance-authority (CVA)

### Important Implementation Details

1. **Path Alias**: Use `@/` import alias for `src/` directory (configured in tsconfig.app.json and vite.config.ts)
2. **Component Pattern**: UI components in `src/components/ui/` use CVA for variant management
3. **Utility Functions**: `src/lib/utils.ts` exports `cn()` helper for merging classNames with Tailwind
4. **Chinese Localization**: UI text is in Chinese (e.g., "首页", "上传记录", "用户管理", "管理员")
5. **Router Configuration**: Routes are defined in `src/app.tsx` using React Router v7 syntax

## When Adding Features

1. Use the existing component patterns in `src/components/ui/` for consistency
2. Follow the TypeScript strict mode requirements
3. Add routes to `src/app.tsx` when creating new pages
4. Use TailwindCSS classes with the existing design tokens
5. Maintain Chinese localization for user-facing text
6. Consider adding tests when implementing core functionality (Jest/Vitest can be configured)
7. Add environment variables to `.env` for API endpoints when integrating with backend

## Expanding ESLint (from README.md)

For production development, update `eslint.config.js` to enable type-aware linting:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Replace tseslint.configs.recommended with:
      tseslint.configs.recommendedTypeChecked,
      // Or for stricter rules:
      tseslint.configs.strictTypeChecked,
      // For stylistic rules:
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

Consider installing `eslint-plugin-react-x` and `eslint-plugin-react-dom` for React-specific lint rules.
