import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

/* ESLint flat config (Next 16 removed `next lint`). Same rules as the
   old .eslintrc.json: next/core-web-vitals, the Studio left out. */
export default defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'node_modules/**', 'studio/**', 'next-env.d.ts']),
]);
