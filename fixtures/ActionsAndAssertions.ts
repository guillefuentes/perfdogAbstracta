import { test as base } from '@playwright/test';
import { PetStoreActions, generatePetName, createPetObject, delay } from '@actions/petstore.actions';
import { PetStoreAssertions } from '@assertions/petstore.assertions';

type ApiFixtures = {
  actions: PetStoreActions;
  assert: PetStoreAssertions;
};

export const test = base.extend<ApiFixtures>({
  actions: async ({ request }, use) => {
    await use(new PetStoreActions(request));
  },
  assert: async ({}, use) => {
    await use(new PetStoreAssertions());
  },
});

// Re-export helper functions for convenience
export { generatePetName, createPetObject, delay };

