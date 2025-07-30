## Setup & Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```
2. **Run database migrations (Drizzle):**

   ```bash
   pnpm drizzle-kit push:pg
   # or use your preferred migration command
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```
   Visit [http://localhost:3000](http://localhost:3000).

## Database Seeding

After running migrations, seed the database with initial data (including example accounts and roles):

```bash
pnpm tsx bus-schedulling/src/db/seed.ts
# or
npx tsx bus-schedulling/src/db/seed.ts
```

This will create test users with the following credentials and roles:

| Role       | Email               | Password      |
| ---------- | ------------------- | ------------- |
| Admin      | admin@test.com      | admin123      |
| Dispatcher | dispatcher@test.com | dispatcher123 |
| Viewer     | viewer@test.com     | viewer123     |

Additional random users, drivers, buses, routes, and shifts will also be seeded for demo and testing purposes.

## Testing

Run all tests:

```bash
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

## Linting

```bash
pnpm lint
```

## Building for Production

```bash
pnpm build
pnpm start
```

## Docker Usage

Build and run with Docker:

```bash
docker build -t bus-schedulling .
docker run -p 3000:3000 --env-file .env bus-schedulling
```

## Developer Experience

- Uses Shadcn UI, Radix UI, and Tailwind for rapid, accessible UI development
- TypeScript interfaces and functional patterns throughout
- Hot reload and fast refresh enabled
- Pre-configured ESLint and Jest for code quality
- Modular file structure for easy navigation

---

For more details, see the codebase and comments. Contributions welcome!
