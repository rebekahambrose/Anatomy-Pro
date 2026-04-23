import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

/** GitHub project pages need assets under /repo/; user/org site (e.g. user.github.io) uses /. */
function githubPagesBase(): string {
  if (process.env.GITHUB_ACTIONS !== 'true') return '/';
  const full = process.env.GITHUB_REPOSITORY;
  if (!full) return '/';
  const [owner, repo] = full.split('/');
  if (!owner || !repo) return '/';
  if (repo === `${owner}.github.io`) return '/';
  return `/${repo}/`;
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: githubPagesBase(),
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
