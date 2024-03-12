## Initialize the Backend
Whenever you’re building a project, usually the first thing you should do is initialise the project’s backend.

Create a new folder called `medium`

```bash
mkdir medium
cd medium
```

Initialize a `hono` based cloudflare worker app

```bash
npm create hono@latest
```

Target directory › `backend`

Which template do you want to use? - `cloudflare-workers`

Do you want to install project dependencies? … yes Which package manager do you want to use? › npm

***Hono** is used as in place for the Express for the Backend because Express doesn't run on Cloudflare Workers.*

Testing the Hono Backend:
```bash
cd backend
npm run dev
```

## Initialize handlers

The backend have 4 routes in backend/src/index.ts

    POST /api/v1/user/signup

    POST /api/v1/user/signin

    POST /api/v1/blog

    PUT /api/v1/blog

    GET /api/v1/blog/:id

    GET /api/v1/blog/bulk



[Hono Routing Doc](https://hono.dev/api/routing)

# Initialize DB (prisma)

#### 1. Get your connection url from neon.db or aieven.tech (Getting the Postgres DB)

```javascript
postgres://avnadmin:password@host/db
```

#### 2. Get connection pool URL from Prisma accelerate

[https://www.prisma.io/data-platform/accelerate](https://www.prisma.io/data-platform/accelerate)

```javascript
prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNTM2M2U5ZjEtNmNjMS00MWNkLWJiZTctN2U4NzFmMGFhZjJmIiwidGVuYW50X2lkIjoiY2I5OTE2NDk0MzFkNWZmZWRmNmFiYzViMGFlOTIwYzFhZDRjMGY5MTg1ZjZiNDY0OTc3MzgyN2IyMzY2OWIwMiIsImludGVybmFsX3NlY3JldCI6Ijc0NjE4YWY2LTA4NmItNDM0OC04MzIxLWMyMmY2NDEwOTExNyJ9.HXnE3vZjf8YH71uOollsvrV-TSe41770FPG_O8IaVgs
```

#### 3. Initialize prisma in your project

Make sure you are in the `backend` folder

```javascript
npm i prisma
npx prisma init
```

Replace `DATABASE_URL` in `.env`

```javascript
DATABASE_URL="postgres://avnadmin:password@host/db"
```

Add `DATABASE_URL` as the `connection pool` url in `wrangler.toml`

```javascript
name = "backend"
compatibility_date = "2023-12-01"

[vars]
DATABASE_URL = "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNTM2M2U5ZjEtNmNjMS00MWNkLWJiZTctN2U4NzFmMGFhZjJmIiwidGVuYW50X2lkIjoiY2I5OTE2NDk0MzFkNWZmZWRmNmFiYzViMGFlOTIwYzFhZDRjMGY5MTg1ZjZiNDY0OTc3MzgyN2IyMzY2OWIwMiIsImludGVybmFsX3NlY3JldCI6Ijc0NjE4YWY2LTA4NmItNDM0OC04MzIxLWMyMmY2NDEwOTExNyJ9.HXnE3vZjf8YH71uOollsvrV-TSe41770FPG_O8IaVgs"
```

💡

You should not have your prod URL committed either in .env or in wrangler.toml to github wranger.toml should have a dev/local DB url .env should be in .gitignore

#### 4. Initialize the schema

```javascript
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String   @id @default(uuid())
  email    String   @unique
  name     String?
  password String
  posts    Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

#### 5. Migrate your database

```shell
npx prisma migrate dev --name init_schema
```

💡

You might face issues here, try changing your wifi if that happens

#### 6. Generate the prisma client

```shell
npx prisma generate --no-engine
```

#### 7. Add the accelerate extension

```shell
npm install @prisma/extension-accelerate
```

#### 8. Initialize the prisma client

```javascript
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())
```