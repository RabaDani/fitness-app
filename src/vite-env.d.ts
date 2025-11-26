/// <reference types="vite/client" />

// Extend the Vite ImportMetaEnv interface with custom env variables
interface ImportMetaEnv {
  readonly VITE_SPOONACULAR_API_KEY: string
}
