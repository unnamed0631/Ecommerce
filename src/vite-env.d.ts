/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACK_END_API?: string;
  readonly VITE_PAYPAL_CLIENT_ID?: string;
  readonly VITE_DEFAULT_PFP?: string;
  readonly VITE_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
