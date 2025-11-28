/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Extend the Vite ImportMetaEnv interface with custom env variables
interface ImportMetaEnv {
  readonly VITE_SPOONACULAR_API_KEY: string
}
