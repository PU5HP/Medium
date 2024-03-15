1.first made component for the signup page in folder components

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
