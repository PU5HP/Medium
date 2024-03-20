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

You should not have your prod URL committed either in .env or in wrangler.toml to github wrangler.toml should have a dev/local DB url .env should be in .gitignore

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

# Step 5 - Create non auth routes

#### 1. Simple Signup route

Add the logic to insert data to the DB, and if an error is thrown, tell the user about it

Solution

💡

To get the right types on `c.env`, when initializing the Hono app, pass the types of env as a generic

```typescript
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
	}
}>();
```

💡

Ideally you shouldn’t store passwords in plaintext. You should hash before storing them. More details on how you can do that - [https://community.cloudflare.com/t/options-for-password-hashing/138077](https://community.cloudflare.com/t/options-for-password-hashing/138077) [https://developers.cloudflare.com/workers/runtime-apis/web-crypto/](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)

#### 2. Add JWT to signup route

Also add the logic to return the user a `jwt` when their user id encoded. This would also involve adding a new env variable `JWT_SECRET` to wrangler.toml

💡

Use jwt provided by hono - [https://hono.dev/helpers/jwt](https://hono.dev/helpers/jwt)

Solution

```javascript
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from 'hono/jwt'

// Create the main Hono app
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();


app.post('/api/v1/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
})

```

#### 3. Add a signin route

Solution

```javascript

app.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})

```

# Step 6 - Middlewares

Creating a middleware in hono is well documented - [https://hono.dev/guides/middleware](https://hono.dev/guides/middleware)

### 1. Limiting the middleware

To restrict a middleware to certain routes, you can use the following -

```javascript
app.use('/message/*', async (c, next) => {
  await next()
})
```

In our case, the following routes need to be protected -

```javascript

app.get('/api/v1/blog/:id', (c) => {})

app.post('/api/v1/blog', (c) => {})

app.put('/api/v1/blog', (c) => {})
```

So we can add a top level middleware

```javascript
app.use('/api/v1/blog/*', async (c, next) => {
  await next()
})
```

### 2. Writing the middleware

Write the logic that extracts the user id and passes it over to the main route.

How to pass data from middleware to the route handler?How to make sure the types of `variables` that are being passed is correct?Solution

### 3. Confirm that the user is able to access authenticated routes

```javascript
app.post('/api/v1/blog', (c) => {
	console.log(c.get('userId'));
	return c.text('signin route')
})
```

Send the Header from Postman and ensure that the user id gets logged on the server

### Callout

💡

If you want, you can extract the prisma variable in a global middleware that set’s it on the context variable

```javascript
app.use(”*”, (c) => {
	const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  c.set(”prisma”, prisma);
})
```

Ref [https://stackoverflow.com/questions/75554786/use-cloudflare-worker-env-outside-fetch-scope](https://stackoverflow.com/questions/75554786/use-cloudflare-worker-env-outside-fetch-scope)
# Step 7 - Blog routes and better routing

### Better routing

[https://hono.dev/api/routing#grouping](https://hono.dev/api/routing#grouping)

Hono let’s you group routes together so you can have a cleaner file structure.

Create two new files -

`routes/user.ts`

`routes/blog.ts` and push the user routes to `user.ts`

index.tsuser.ts

## Blog routes

### 1. Create the route to initialize a blog/post

Solution

```javascript
app.post('/', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId
		}
	});
	return c.json({
		id: post.id
	});
})

```

### 2. Create the route to update blog

Solution

```javascript
app.put('/api/v1/blog', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.text('updated post');
});
```

### 3. Create the route to get a blog

Solution

```javascript
app.get('/api/v1/blog/:id', async (c) => {
	const id = c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});

	return c.json(post);
})
```

### 4. Create the route to get all blogs

Solution

```javascript
app.get('/api/v1/blog/bulk', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const posts = await prisma.post.find({});

	return c.json(posts);
})
```

Try to hit the routes via POSTMAN and ensure they work as expected

![notion image](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F635489e9-5e15-4002-ac6d-86a5f9f84e4b%2FScreenshot_2024-02-24_at_11.44.00_AM.png?table=block&id=4335acbe-6a2c-4513-bb4e-deb8aba8b71f&cache=v2)
# Step 8 - Understanding the types

### Bindings

[https://hono.dev/getting-started/cloudflare-workers#bindings](https://hono.dev/getting-started/cloudflare-workers#bindings)

![notion image](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F3fe02296-f411-4b2c-9611-d644cdc75491%2FScreenshot_2024-02-25_at_12.28.23_PM.png?table=block&id=2153228f-6353-4dbf-a0b3-30e9a6c3127e&cache=v2)

#### In our case, we need 2 env variables -

JWT_SECRET

DATABASE_URL

![notion image](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F988e2352-4a8e-4e5d-850b-4f51baa0c312%2FScreenshot_2024-02-25_at_12.32.56_PM.png?table=block&id=b8a4776c-a778-4916-b598-fb3c9747a25d&cache=v2)

### Variables

[https://hono.dev/api/context#var](https://hono.dev/api/context#var)

If you wan’t to get and set values on the context of the request, you can use `c.get` and `c.set`

![notion image](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F05913613-86e4-4b13-87b0-8e01e5f8be5a%2FScreenshot_2024-02-25_at_12.37.08_PM.png?table=block&id=9a8d2c29-f8c8-4b68-853c-01ca7159fcb0&cache=v2)

You need to make typescript `aware` of the variables that you will be setting on the context.

![notion image](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2Fc56ce270-8d5f-4234-852e-a30b6ab7ee88%2FScreenshot_2024-02-25_at_12.38.33_PM.png?table=block&id=12f2be2b-043e-4e61-9dee-537f9286fdb9&cache=v2)

💡

You can also create a middleware that sets `prisma` in the context so you don’t need to initialise it in the function body again and again
# Step 9 - Deploy your app

```javascript
npm run deploy
```

💡

Make sure you have logged in the cloudflare cli using `npx wrangler login`

### Update the env variables from cloudflare dashboard

![notion image](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F7b4c9187-b872-42d0-8f78-96e74a17a131%2FScreenshot_2024-02-24_at_12.06.20_PM.png?table=block&id=00d9d4a3-424f-4970-b9fc-6a9459382174&cache=v2)

Test your production URL in postman, make sure it works
# Step 10 - Zod validation

If you’ve gone through the video `Cohort 1 - Deploying npm packages, Intro to Monorepos`, you’ll notice we introduced type inference in `Zod`

[https://zod.dev/?id=type-inference](https://zod.dev/?id=type-inference)

This let’s you get types from `runtime zod variables` that you can use on your frontend

![notion image](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F082a51ca-7f1b-46d8-90f9-c751e4f8cbe1%2FScreenshot_2024-02-24_at_12.30.12_PM.png?table=block&id=70aad17f-5b10-4804-8d58-deab3523f015&cache=v2)

We will divide our project into 3 parts

1.  Backend

2.  Frontend

3.  common

`common` will contain all the things that frontend and backend want to share. We will make `common` an independent `npm module` for now. Eventually, we will see how `monorepos` make it easier to have multiple packages sharing code in the same repo
# Step 11 - Initialise common

1.  Create a new folder called `common` and initialize an empty ts project in it

```javascript
mkdir common
cd common
npm init -y
npx tsc --init
```

1.  Update `tsconfig.json`

```javascript
"rootDir": "./src",
"outDir": "./dist",
"declaration": true,
```

1.  Sign up/login to npmjs.org

2.  Run `npm login`

3.  Update the `name` in `package.json` to be in your own npm namespace, Update main to be `dist/index.js`

```javascript
{
  "name": "@100xdevs/common-app",
  "version": "1.0.0",
  "description": "",
	"main": "dist/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```

1.  Add `src` to `.npmignore`

2.  Install zod

```javascript
npm i zod
```

1.  Put all types in `src/index.ts`

1.  signupInput / SignupInput
2.  signinInput / SigninInput
3.  createPostInput / CreatePostInput
4.  updatePostInput / UpdatePostInput

Solution

1.  `tsc -b` to generate the output

2.  Publish to npm

```javascript
npm publish --access public
```

1.  Explore your package on npmjs
2. # Step 12 - Import zod in backend

1.  Go to the backend folder

```javascript
cd backend
```

1.  Install the package you published to npm

```javascript
npm i your_package_name
```

1.  Explore the package

```javascript
cd node_modules/your_package_name
```

1.  Update the routes to do zod validation on them

Solution

```javascript
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt'
import { signinInput, signupInput, createPostInput, updatePostInput } from "@100xdevs/common-app"

// Create the main Hono app
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	},
	Variables : {
		userId: string
	}
}>();

app.use('/api/v1/blog/*', async (c, next) => {
	const jwt = c.req.header('Authorization');
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];
	const payload = await verify(token, c.env.JWT_SECRET);
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set('userId', payload.id);
	await next()
})

app.post('/api/v1/signup', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = signupInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
})

app.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = signinInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
	const user = await prisma.user.findUnique({
		where: {
			email: body.email
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})

app.get('/api/v1/blog/:id', async (c) => {
	const id = c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});

	return c.json(post);
})

app.post('/api/v1/blog', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = createPostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId
		}
	});
	return c.json({
		id: post.id
	});
})

app.put('/api/v1/blog', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const { success } = updatePostInput.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}

	prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.text('updated post');
});

export default app;

```
# Step 13 - Init the FE project

1.  Initialise a react app

```javascript
npm create vite@latest
```

1.  Initialise tailwind [https://tailwindcss.com/docs/guides/vite](https://tailwindcss.com/docs/guides/vite)

```javascript
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

1.  Update tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

1.  Update index.css

```javascript
@tailwind base;
@tailwind components;
@tailwind utilities;
```

1.  Empty up App.css

2.  Install your package

```javascript
npm i your_package
```

1.  Run the project locally

```javascript
npm run dev
```
#  Front end setup-Commands

```javascript
 npm create vite@latest
 
 Project name: … frontend
 ✔ Select a framework: › React
 ✔ Select a variant: › TypeScript

  cd frontend
  npm install
  npm run dev
  npm i @pu5hp/medium-common
  npm i react-router-dom
```
1.  Initialise tailwind [https://tailwindcss.com/docs/guides/vite](https://tailwindcss.com/docs/guides/vite)

```javascript
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

1.  Update tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

1.  Update index.css

```javascript
@tailwind base;
@tailwind components;
@tailwind utilities;
```

1.  Empty up App.css

2.  Install your package

```javascript
npm i your_package
```

1.  Run the project locally

```javascript
npm run dev
```
# Vite

Install and configure Vite.

### [](https://ui.shadcn.com/docs/installation/vite#create-project)Create project

Start by creating a new React project using `vite`:

```
npm create vite@latest
```

### [](https://ui.shadcn.com/docs/installation/vite#add-tailwind-and-its-configuration)Add Tailwind and its configuration

Install `tailwindcss` and its peer dependencies, then generate your `tailwind.config.js` and `postcss.config.js` files:

```
npm install -D tailwindcss postcss autoprefixer
 
npx tailwindcss init -p
```

### [](https://ui.shadcn.com/docs/installation/vite#edit-tsconfigjson-file)Edit tsconfig.json file

Add the following code to the `tsconfig.json` file to resolve paths:

```
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
```
# Using the [shadcn/ui](https://ui.shadcn.com/)
### [](https://ui.shadcn.com/docs/installation/vite#update-viteconfigts)Update vite.config.ts

Add the following code to the vite.config.ts so your app can resolve paths without error

```
# (so you can import "path" without error)
npm i -D @types/node
```

```
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### [](https://ui.shadcn.com/docs/installation/vite#run-the-cli)Run the CLI

Run the `shadcn-ui` init command to setup your project:

```
npx shadcn-ui@latest init
```

### [](https://ui.shadcn.com/docs/installation/vite#configure-componentsjson)Configure components.json

You will be asked a few questions to configure `components.json`:

```
Would you like to use TypeScript (recommended)? no / yes
Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Where is your global CSS file? › › src/index.css
Do you want to use CSS variables for colors? › no / yes
Where is your tailwind.config.js located? › tailwind.config.js
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › no / yes (no)
```

### [](https://ui.shadcn.com/docs/installation/vite#thats-it)That's it

You can now start adding components to your project.

```
npx shadcn-ui@latest add button
```

The command above will add the `Button` component to your project. You can then import it like this:

```
import { Button } from "@/components/ui/button"
 
export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  )
}
```