import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    ignores: ['dist/', 'build/', 'node_modules/'],
  },
  {
    files: ['src/**/*.{js,mjs,cjs,jsx,ts,tsx}'],
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },
  eslintPluginPrettierRecommended,
];
