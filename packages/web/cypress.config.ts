import { defineConfig } from 'cypress';
import path from 'path';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: () => {
        return {
          configFile: path.resolve(__dirname, 'vite.config.ts'),
        };
      },
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: path.resolve(__dirname, '../../cypress/support/component.js'),
    indexHtmlFile: path.resolve(__dirname, '../../cypress/support/component-index.html'),
  },
});
