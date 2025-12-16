# Anti-Korrupt Learning Platform - Backend

A comprehensive NestJS backend for a single-course learning platform focused on anti-corruption education.

## Features

- 🔐 **Simple Authentication**: Last-name based login (auto-creates users)
- 📚 **Module Management**: Structured course modules with various resource types
- 🎯 **Quiz System**: Randomized questions with scoring and progress tracking
- 📊 **Progress Tracking**: User completion tracking and knowledge tokens
- 🔍 **Content Search**: Full-text search across module content
- 🗄️ **Polymorphic Resources**: Support for videos, quizzes, flashcards, slides, infographics, reports, audio, and games
- 📦 **JSON Seeding**: Easy module creation via JSON files

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (Passport.js)
- **Validation**: Zod + class-validator
- **Storage**: AWS S3 (for media files)

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- pnpm (recommended) or npm
- AWS S3 account (for production media storage)

## Installation

```bash
# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/anti_korrupt_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AWS S3 (Optional for development)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=anti-korrupt-resources

# Application
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Database Setup

```bash
# Generate migrations
pnpm db:generate

# Push schema to database
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Running the Application

```bash
# Development mode
pnpm start:dev

# Production mode
pnpm build
pnpm start:prod
```

The API will be available at `http://localhost:3001/api`

## Module Seeding

### Creating Module JSON Files

Place module JSON files in the `modules/` directory with numeric names (1.json, 2.json, etc.).

See `modules/1.json` and `modules/2.json` for complete examples.

### Running the Seed Command

```bash
# Seed all modules from the modules/ directory
pnpm seed:modules
```

**Seeding behavior:**
- Skips modules that already exist (based on `order` field)
- Validates JSON with Zod schemas
- Creates all resources and relationships in a single transaction
- Indexes searchable content (reports, subtitles) automatically

## API Endpoints

### Authentication

```
POST   /api/auth/login              # Login with last name
GET    /api/auth/me                 # Get current user (protected)
```

### Modules

```
GET    /api/modules                 # List all modules with completion status
GET    /api/modules/:id             # Get module with resources
GET    /api/modules/:id/search?q=   # Search content within module
```

### Resources

```
GET    /api/resources/videos/:id
GET    /api/resources/quizzes/:id
GET    /api/resources/flashcards/:id
GET    /api/resources/slides/:id
GET    /api/resources/infographics/:id
GET    /api/resources/reports/:id
GET    /api/resources/audio/:id
GET    /api/resources/games/:id
```

### Quiz

```
GET    /api/quizzes/:id/questions   # Get random quiz questions
POST   /api/quizzes/:id/attempts    # Submit quiz answers
GET    /api/quizzes/:id/attempts    # Get attempt history
```

### Progress

```
GET    /api/users/me/progress       # Get user progress and knowledge tokens
```

## Business Logic

### Module Completion

- User completes a module by passing the quiz (score ≥ 80%)
- First-time completion awards 1 knowledge token
- Module completion unlocks the next module
- Completion updates overall progress percentage

### Quiz System

- Questions are randomly selected from pool on each attempt
- Number of questions: configurable per quiz (default: 5)
- Passing score: configurable (default: 80%)
- Users can retake quizzes unlimited times
- Each attempt gets fresh random questions

## License

UNLICENSED (Private Project)
