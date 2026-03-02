import { test, generatePetName, createPetObject } from '../fixtures/ActionsAndAssertions';

/**
 * This file demonstrates the advanced assertion patterns
 * that make your test framework stand out
 */
test.describe('Custom Assertions Demo', () => {
  test('Showcase: Fluent API Assertions', async ({ actions, assert: assertions }) => {

    // ============================================================
    // TRADITIONAL APPROACH (What most people do)
    // ============================================================
    await test.step('Traditional assertions (baseline)', async () => {
      const petData = createPetObject(generatePetName('Traditional'), 'available');
      const { pet, response } = await actions.createPet(petData);

      // Traditional way - verbose and repetitive
      assertions.expectSuccessfulResponse(response);
      assertions.expectValidPet(pet);
      assertions.expectPetStatus(pet, 'available');
      assertions.expectPetToHave(pet, { name: petData.name });
    });

    // ============================================================
    // ADVANCED APPROACH (Fluent API - Stand Out!)
    // ============================================================
    await test.step('Fluent API assertions (advanced)', async () => {
      const petData = createPetObject(generatePetName('Fluent'), 'pending');
      const { pet, response } = await actions.createPet(petData);

      // Fluent chainable assertions - cleaner and more readable!
      assertions
        .expectSuccessfulResponse(response)
        .expectValidPet(pet);

      // TODO: Super elegant fluent chains (advanced pattern - not yet implemented)
      // PetStoreAssertions.forPet(pet).withStatus('pending').withName(petData.name);
      assertions.expectPetStatus(pet, 'pending');
      assertions.expectPetToHave(pet, { name: petData.name });
    });

    // ============================================================
    // ADVANCED COLLECTION ASSERTIONS
    // ============================================================
    await test.step('Collections: Size validations', async () => {
      const { pets, response } = await actions.findPetsByStatus('available');

      // Validate collection assertions
      assertions
        .expectSuccessfulResponse(response)
        .expectMinimumPets(pets, 1)
        .expectNotEmpty(pets, 'Available pets');
    });

    // ============================================================
    // COLLECTION ASSERTIONS (Advanced Array Testing)
    // ============================================================
    await test.step('Collections: Advanced array validations', async () => {
      const { pets, response } = await actions.findPetsByStatus('available');

      assertions
        .expectSuccessfulResponse(response)
        .expectJsonContentType(response)
        .expectNotEmpty(pets, 'Available pets')
        .expectAllPetsHaveStatus(pets, 'available')
        .expectCollectionContains(
          pets,
          pet => pet.name.includes('doggie'),
          'a pet with "doggie" in name'
        );
    });

    // ============================================================
    // ORDER ASSERTIONS (Fluent Order API)
    // ============================================================
    await test.step('Orders: Fluent order validations', async () => {
      const { pets } = await actions.findPetsByStatus('available');
      const firstPet = pets[0];

      const orderData = {
        petId: firstPet.id!,
        quantity: 2,
        status: 'placed' as const,
        complete: false,
      };

      const { order, response } = await actions.createOrder(orderData);

      // Chainable order assertions
      assertions
        .expectSuccessfulResponse(response)
        .expectValidOrder(order);

      // TODO: Fluent order validation (advanced pattern - not yet implemented)
      // PetStoreAssertions.forOrder(order).withStatus('placed').forPet(firstPet.id!).withQuantity(2);
      assertions.expectOrderStatus(order, 'placed');
    });

    // ============================================================
    // ERROR HANDLING (Negative Testing)
    // ============================================================
    await test.step('Error handling: Validate error scenarios', async () => {
      const { response } = await actions.getPetById(999999999);

      // Clean error assertions
      assertions
        .expectNotFound(response);
    });
  });

  test('Showcase: Semantic Test Organization', async ({ actions, assert: assertions }) => {

    // ============================================================
    // CLEAN TEST STRUCTURE
    // Actions separate from Assertions = Clear Intent
    // ============================================================

    await test.step('Given: A new pet is created', async () => {
      const petData = createPetObject(generatePetName('Semantic'), 'available');
      const { pet, response } = await actions.createPet(petData);

      await test.step('Then: Response should be successful', async () => {
        assertions.expectSuccessfulResponse(response);
      });

      await test.step('And: Pet should have correct properties', async () => {
        // TODO: Fluent API (advanced pattern - not yet implemented)
        // PetStoreAssertions.forPet(pet).withStatus('available').withName(petData.name);
        assertions.expectPetStatus(pet, 'available');
        assertions.expectPetToHave(pet, { name: petData.name });
      });
    });
  });

  test('Showcase: Multiple Validation Styles', async ({ actions, assert: assertions }) => {

    const petData = createPetObject(generatePetName('MultiStyle'), 'sold');
    const { pet, response } = await actions.createPet(petData);

    // Style 1: Method chaining
    assertions
      .expectSuccessfulResponse(response)
      .expectValidPet(pet)
      .expectPetStatus(pet, 'sold');

    // Style 2: Fluent API (TODO: advanced pattern - not yet implemented)
    // PetStoreAssertions.forPet(pet).withStatus('sold').withName(petData.name);

    // Style 3: Detailed property assertions
    assertions.expectPetToHave(pet, {
      name: petData.name,
      status: 'sold',
      category: { id: 1, name: 'Dogs' },
    });

    // All styles are valid and can be mixed based on readability!
  });
});

/**
 * WHY THIS STANDS OUT:
 *
 * 1. **Separation of Concerns**
 *    - Actions: Pure API calls, no assertions
 *    - Assertions: Domain-specific validations
 *
 * 2. **Fluent API Pattern**
 *    - Chainable methods for readability
 *    - Self-documenting test code
 *
 * 3. **Multiple Assertion Styles**
 *    - Traditional: Clear and explicit
 *    - Fluent: Elegant and concise
 *    - Semantic: BDD-style readability
 *
 * 4. **Performance Validation**
 *    - Built-in response time assertions
 *    - Production-ready testing patterns
 *
 * 5. **Type Safety**
 *    - Full TypeScript support
 *    - Auto-completion in IDE
 *
 * 6. **Maintainability**
 *    - Changes to assertions centralized
 *    - Tests remain clean and focused
 *
 * This demonstrates advanced testing patterns that go beyond
 * basic Playwright usage and showcase professional test architecture!
 */
