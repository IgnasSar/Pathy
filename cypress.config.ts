import { defineConfig } from 'cypress';
import path from 'path';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: () => {
        return {
          configFile: path.resolve(__dirname, 'packages/web/vite.config.ts'),
        };
      },
    },
    specPattern: 'packages/web/src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
    indexHtmlFile: 'cypress/support/component-index.html',
  },
});
