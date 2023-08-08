/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// todo: fix types
declare module '@vkruglikov/react-telegram-web-app'

type ImportMetaEnv = {
  readonly VITE_FEEDBACK_TOKEN: string
}
