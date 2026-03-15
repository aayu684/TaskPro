import os
import json

def write_file(path, content):
    with open(path, "w") as f:
        f.write(content)

os.makedirs("frontend/src", exist_ok=True)
os.makedirs("frontend/public", exist_ok=True)

package_json = {
  "name": "taskpro-frontend",
  "private": True,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.7",
    "lucide-react": "^0.330.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.0"
  }
}

write_file("frontend/package.json", json.dumps(package_json, indent=2))

tsconfig_json = {
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": True,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": True,

    # Bundler mode
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": True,
    "resolveJsonModule": True,
    "isolatedModules": True,
    "noEmit": True,
    "jsx": "react-jsx",

    # Linting
    "strict": True,
    "noUnusedLocals": True,
    "noUnusedParameters": True,
    "noFallthroughCasesInSwitch": True
  },
  "include": ["src"],
  "references": [{"path": "./tsconfig.node.json"}]
}
write_file("frontend/tsconfig.json", json.dumps(tsconfig_json, indent=2))

tsconfig_node_json = {
  "compilerOptions": {
    "composite": True,
    "skipLibCheck": True,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": True
  },
  "include": ["vite.config.ts"]
}
write_file("frontend/tsconfig.node.json", json.dumps(tsconfig_node_json, indent=2))

vite_config_ts = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
"""
write_file("frontend/vite.config.ts", vite_config_ts)

index_html = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaskPro</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"""
write_file("frontend/index.html", index_html)

main_tsx = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"""
write_file("frontend/src/main.tsx", main_tsx)

app_tsx = """import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">TaskPro</h1>
    </div>
  )
}

export default App
"""
write_file("frontend/src/App.tsx", app_tsx)

index_css = """@tailwind base;
@tailwind components;
@tailwind utilities;
"""
write_file("frontend/src/index.css", index_css)

tailwind_config_js = """/** @type {import('tailwindcss').Config} */
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
"""
write_file("frontend/tailwind.config.js", tailwind_config_js)

postcss_config_js = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"""
write_file("frontend/postcss.config.js", postcss_config_js)

print("Frontend scaffolding complete.")
