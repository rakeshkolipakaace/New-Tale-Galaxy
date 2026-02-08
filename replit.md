# StoryVoice

## Overview

StoryVoice is a React Native (Expo) mobile application that presents a collection of classic fables and stories with interactive reading features. Users can browse stories, tap on words for explanations, and use text-to-speech functionality. The app uses a dark-themed, gradient-rich UI designed for an immersive reading experience.

The project follows a full-stack architecture with an Expo/React Native frontend and an Express.js backend server, connected to a PostgreSQL database via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)
- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`)
- **Routing**: expo-router with file-based routing. The app has two main screens:
  - `app/index.tsx` — Home screen with a list of story cards
  - `app/story/[id].tsx` — Individual story reader with word-level interaction, text-to-speech (expo-speech), and haptic feedback
- **State Management**: React Query (`@tanstack/react-query`) for server state; local React state for UI interactions
- **Animations**: `react-native-reanimated` for smooth animations (e.g., word highlighting during read-aloud)
- **Fonts**: Google Fonts via `@expo-google-fonts` — Playfair Display for headings, Inter for body text
- **Styling**: StyleSheet-based with a custom color palette defined in `constants/colors.ts`. Dark navy theme with gold/coral accents.
- **Data**: Stories are currently hardcoded in `constants/stories.ts` as static data (not fetched from the backend yet)
- **Key Libraries**: expo-speech, expo-haptics, expo-linear-gradient, expo-image, react-native-gesture-handler, react-native-safe-area-context

### Backend (Express.js)
- **Runtime**: Node.js with TypeScript (compiled via `tsx` for dev, `esbuild` for production)
- **Server**: Express 5 with a custom CORS setup that supports Replit dev/deployment domains and localhost
- **API Structure**: Routes registered in `server/routes.ts`, prefixed with `/api`. Currently minimal — a skeleton ready for expansion.
- **Storage Layer**: Abstracted via `IStorage` interface in `server/storage.ts`. Currently uses in-memory storage (`MemStorage`) with a `Map`. This can be swapped for database-backed storage.

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` — currently has a `users` table with id (UUID), username, and password
- **Migrations**: Drizzle Kit configured in `drizzle.config.ts`, outputs to `./migrations/`
- **Schema Validation**: Uses `drizzle-zod` to generate Zod schemas from Drizzle table definitions
- **Push Command**: `npm run db:push` to push schema to database

### Build & Deployment
- **Development**: Two parallel processes — `expo:dev` for the mobile app, `server:dev` for the Express backend
- **Production**: Static web build via custom `scripts/build.js`, server bundled with esbuild to `server_dist/`
- **The Express server serves the static web build in production and proxies to Metro in development**
- **Environment**: Uses `EXPO_PUBLIC_DOMAIN` for API URL resolution, `DATABASE_URL` for Postgres connection

### Shared Code
- The `shared/` directory contains code used by both frontend and backend (currently the database schema and types)
- Path aliases: `@/*` maps to project root, `@shared/*` maps to `./shared/*`

## External Dependencies

### Database
- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable
- **Drizzle ORM** — Query builder and schema management
- **pg** — Node.js PostgreSQL client driver

### Key NPM Packages
- **expo** (~54.0.27) — Mobile app framework
- **express** (^5.0.1) — Backend HTTP server
- **@tanstack/react-query** — Async state management for API calls
- **expo-speech** — Text-to-speech for story narration
- **expo-haptics** — Haptic feedback on word interactions
- **react-native-reanimated** — High-performance animations
- **zod** — Runtime schema validation (via drizzle-zod)
- **esbuild** — Server bundling for production
- **patch-package** — Applied via postinstall for any dependency patches

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required for database)
- `EXPO_PUBLIC_DOMAIN` — Domain for API requests from the mobile app
- `REPLIT_DEV_DOMAIN` — Used for CORS and Expo dev server configuration
- `REPLIT_DOMAINS` — Comma-separated list of allowed CORS origins in deployment