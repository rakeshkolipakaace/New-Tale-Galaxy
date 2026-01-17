# StoryTime - Interactive Reading Application

## Overview

StoryTime is an interactive children's reading application that provides an engaging story experience with voice recognition and quizzes. The app presents stories in a digital book format with genre-based categorization, age-appropriate content filtering, text-to-speech narration, speech-to-text reading practice, and comprehension quizzes after each story.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS v4 with custom theme variables defined in CSS
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and interactive animations

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful API structure (routes prefixed with `/api`)
- **Development**: tsx for TypeScript execution, Vite dev server with HMR

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - shared between client and server
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Current Storage**: In-memory storage implementation (`MemStorage` class) for development
- **Database Ready**: PostgreSQL configuration in place via `drizzle.config.ts`

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/  # UI components including shadcn/ui
│   │   ├── pages/       # Route pages (Home, Book, StorySelection)
│   │   ├── hooks/       # Custom hooks (voice, mobile, toast)
│   │   └── lib/         # Utilities and story data
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer
│   └── static.ts     # Static file serving for production
├── shared/           # Shared code between client/server
│   └── schema.ts     # Database schema and types
└── migrations/       # Drizzle database migrations
```

### Key Features Implementation
- **Voice Recognition**: Web Speech API for speech-to-text reading practice
- **Text-to-Speech**: Browser TTS for story narration
- **Story Data**: Currently stored as static data in `lib/storyData.ts`
- **Age Filtering**: Stories categorized by age groups with URL query parameters
- **Quiz System**: Comprehension quizzes with scoring after story completion

### Build System
- **Client Build**: Vite builds to `dist/public`
- **Server Build**: esbuild bundles server code to `dist/index.cjs`
- **Database Migrations**: `npm run db:push` uses Drizzle Kit

## External Dependencies

### Database
- **PostgreSQL**: Required for production (DATABASE_URL environment variable)
- **Drizzle Kit**: Database migrations and schema management

### Third-Party Services
- None currently integrated, but schema supports user authentication

### Key NPM Packages
- **UI Framework**: Radix UI primitives, shadcn/ui components
- **Animations**: Framer Motion, embla-carousel-react
- **Forms**: React Hook Form with Zod resolvers
- **Database**: drizzle-orm, pg (PostgreSQL client)
- **Session Management**: connect-pg-simple, express-session

### Browser APIs
- Web Speech API (SpeechRecognition, SpeechSynthesis)
- Used for voice-based reading features