import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'playwright-report/**', 'test-results/**', '*.config.ts']
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      playwright: playwright
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'off',
      'no-trailing-spaces': 'warn',
      'eol-last': ['warn', 'always']
    }
  },
  {
    files: ['tests/**/*.spec.ts'],
    rules: {
      ...playwright.configs.recommended.rules,
      'playwright/expect-expect': 'off',
      'playwright/no-commented-out-tests': 'warn',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-nested-step': 'off',
      'playwright/no-conditional-in-test': 'off'
    }
  }
];
