import os
import json

def write(path, content):
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding='utf-8') as f:
            f.write(content)
        print(f"Created {path}")
    except Exception as e:
        print(f"Failed to create {path}: {e}")

write("frontend/package.json", json.dumps({
  "name": "taskpro-frontend",
  "private": True,
  "version": "0.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "tsc && vite build", "lint": "eslint . --ext ts,tsx", "preview": "vite preview" },
  "dependencies": { "react": "^18.2.0", "react-dom": "^18.2.0", "react-router-dom": "^6.22.0", "axios": "^1.6.7", "lucide-react": "^0.330.0", "clsx": "^2.1.0", "tailwind-merge": "^2.2.1" },
  "devDependencies": { "@types/react": "^18.2.55", "@types/react-dom": "^18.2.19", "@vitejs/plugin-react": "^4.2.1", "autoprefixer": "^10.4.17", "postcss": "^8.4.35", "tailwindcss": "^3.4.1", "typescript": "^5.2.2", "vite": "^5.1.0" }
}, indent=2))

write("frontend/vite.config.ts", """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()] })""")

write("frontend/tsconfig.json", json.dumps({
  "compilerOptions": { "target": "ES2020", "useDefineForClassFields": True, "lib": ["ES2020", "DOM", "DOM.Iterable"], "module": "ESNext", "skipLibCheck": True, "moduleResolution": "bundler", "allowImportingTsExtensions": True, "resolveJsonModule": True, "isolatedModules": True, "noEmit": True, "jsx": "react-jsx", "strict": True, "noUnusedLocals": True, "noUnusedParameters": True, "noFallthroughCasesInSwitch": True },
  "include": ["src"],
  "references": [{"path": "./tsconfig.node.json"}]
}, indent=2))

write("frontend/tsconfig.node.json", json.dumps({
  "compilerOptions": { "composite": True, "skipLibCheck": True, "module": "ESNext", "moduleResolution": "bundler", "allowSyntheticDefaultImports": True },
  "include": ["vite.config.ts"]
}, indent=2))

write("frontend/index.html", """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TaskPro</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>""")

write("frontend/src/main.tsx", """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)""")

write("frontend/src/App.tsx", """import { useState } from 'react'
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">TaskPro</h1>
    </div>
  )
}
export default App""")

write("frontend/src/index.css", """@tailwind base;
@tailwind components;
@tailwind utilities;""")

write("frontend/tailwind.config.js", """/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}""")

write("frontend/postcss.config.js", """export default { plugins: { tailwindcss: {}, autoprefixer: {} } }""")
