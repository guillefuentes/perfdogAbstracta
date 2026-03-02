import { expect, APIResponse } from '@playwright/test';
import { Pet, PetStatus, Order, OrderStatus } from '@models/api.types';

export class PetStoreAssertions {
  //GENERAL ASSERTIONS

  /** Assert that a value is defined (not null or undefined). */
  expectDefined<T>(value: T | null | undefined, message?: string) {
    expect(value, message || 'Value should be defined').toBeDefined();
    expect(value, message || 'Value should not be null').not.toBeNull();
    return this;
  }

  /** Assert that an array has a specific length. */
  expectArrayLength<T>(array: T[], expectedLength: number, arrayName: string = 'Array') {
    expect(array.length, `${arrayName} should have length ${expectedLength}, but has ${array.length}`).toBe(expectedLength);
    return this;
  }

  //RESPONSE ASSERTIONS

  /** Assert that API response is successful. */
  expectSuccessfulResponse(response: APIResponse, message?: string) {
    expect(response.ok(), message || `Expected successful response, got ${response.status()}`).toBeTruthy();
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);
    return this;
  }

  /** Assert specific status code. */
  expectStatusCode(response: APIResponse, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
    return this;
  }

  /** Assert that response contains JSON content type. */
  expectJsonContentType(response: APIResponse) {
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
    return this;
  }

  //PET ASSERTIONS

  /** Assert that pet object is valid and complete. */
  expectValidPet(pet: Pet) {
    expect(pet, 'Pet object should be defined').toBeDefined();
    expect(pet.id, 'Pet should have an ID').toBeDefined();
    expect(pet.name, 'Pet should have a name').toBeDefined();
    expect(pet.photoUrls, 'Pet should have photoUrls').toBeDefined();
    expect(pet.status, 'Pet should have a status').toBeDefined();
    return this;
  }

  /** Assert pet has specific properties. */
  expectPetToHave(pet: Pet, expectedProperties: Partial<Pet>) {
    if (expectedProperties.id !== undefined) {
      expect(pet.id).toBe(expectedProperties.id);
    }
    if (expectedProperties.name !== undefined) {
      expect(pet.name).toBe(expectedProperties.name);
    }
    if (expectedProperties.status !== undefined) {
      expect(pet.status).toBe(expectedProperties.status);
    }
    if (expectedProperties.category !== undefined) {
      expect(pet.category?.name).toBe(expectedProperties.category.name);
    }
    return this;
  }

  /** Assert pet has specific status. */
  expectPetStatus(pet: Pet, expectedStatus: PetStatus) {
    expect(pet.status).toBe(expectedStatus);
    return this;
  }

  /** Assert pet has required fields for creation. */
  expectPetCreatedSuccessfully(pet: Pet, originalPet: Pet) {
    this.expectValidPet(pet);
    expect(pet.name).toBe(originalPet.name);
    expect(pet.status).toBe(originalPet.status);
    return this;
  }

  /** Assert pet matches expected pet. */
  expectPetMatch(pet: Pet, expectedPet: Pet) {
    expect(pet.id).toBe(expectedPet.id);
    expect(pet.name).toBe(expectedPet.name);
    expect(pet.status).toBe(expectedPet.status);
    return this;
  }

  /** Assert array contains pets with specific status. */
  expectAllPetsHaveStatus(pets: Pet[], expectedStatus: PetStatus) {
    expect(pets.length, 'Pets array should not be empty').toBeGreaterThan(0);
    pets.forEach((pet, index) => {
      expect(pet.status, `Pet at index ${index} should have status ${expectedStatus}`).toBe(expectedStatus);
    });
    return this;
  }

  /** Assert pet exists in array. */
  expectPetInArray(pets: Pet[], petName: string) {
    const found = pets.some(pet => pet.name === petName);
    expect(found, `Pet with name "${petName}" should exist in array`).toBeTruthy();
    return this;
  }

  /** Assert minimum number of pets */
  expectMinimumPets(pets: Pet[], minCount: number) {
    expect(pets.length, `Expected at least ${minCount} pets, got ${pets.length}`).toBeGreaterThanOrEqual(minCount);
    return this;
  }

  //ORDER ASSERTIONS

  /** Assert that order object is valid and complete. */
  expectValidOrder(order: Order) {
    expect(order, 'Order object should be defined').toBeDefined();
    expect(order.id, 'Order should have an ID').toBeDefined();
    expect(order.petId, 'Order should have a petId').toBeDefined();
    expect(order.quantity, 'Order should have a quantity').toBeDefined();
    expect(order.status, 'Order should have a status').toBeDefined();
    return this;
  }

  /** Assert order has specific properties. */
  expectOrderToHave(order: Order, expectedProperties: Partial<Order>) {
    if (expectedProperties.id !== undefined) {
      expect(order.id).toBe(expectedProperties.id);
    }
    if (expectedProperties.petId !== undefined) {
      expect(order.petId).toBe(expectedProperties.petId);
    }
    if (expectedProperties.quantity !== undefined) {
      expect(order.quantity).toBe(expectedProperties.quantity);
    }
    if (expectedProperties.status !== undefined) {
      expect(order.status).toBe(expectedProperties.status);
    }
    if (expectedProperties.complete !== undefined) {
      expect(order.complete).toBe(expectedProperties.complete);
    }
    return this;
  }

  /** Assert order has specific status. */
  expectOrderStatus(order: Order, expectedStatus: OrderStatus) {
    expect(order.status).toBe(expectedStatus);
    return this;
  }

  /** Assert order was created successfully. */
  expectOrderCreatedSuccessfully(order: Order, originalOrder: Order) {
    this.expectValidOrder(order);
    expect(order.petId).toBe(originalOrder.petId);
    expect(order.quantity).toBe(originalOrder.quantity);
    expect(order.status).toBe(originalOrder.status);
    return this;
  }

  /** Assert order matches expected order. */
  expectOrderMatch(order: Order, expectedOrder: Order) {
    expect(order.id).toBe(expectedOrder.id);
    expect(order.petId).toBe(expectedOrder.petId);
    expect(order.quantity).toBe(expectedOrder.quantity);
    expect(order.status).toBe(expectedOrder.status);
    return this;
  }

  /** Assert order belongs to specific pet. */
  expectOrderForPet(order: Order, petId: number) {
    expect(order.petId, `Order should be for pet ${petId}`).toBe(petId);
    return this;
  }

  //COLLECTION ASSERTIONS

  /** Assert collection is not empty. */
  expectNotEmpty<T>(collection: T[], collectionName: string = 'Collection') {
    expect(collection.length, `${collectionName} should not be empty`).toBeGreaterThan(0);
    return this;
  }

  /** Assert exact collection size. */
  expectCollectionSize<T>(collection: T[], expectedSize: number, collectionName: string = 'Collection') {
    expect(collection.length, `${collectionName} should have ${expectedSize} items`).toBe(expectedSize);
    return this;
  }

  /** Assert collection contains item matching predicate. */
  expectCollectionContains<T>(
    collection: T[],
    predicate: (item: T) => boolean,
    description: string = 'matching item'
  ) {
    const found = collection.some(predicate);
    expect(found, `Collection should contain ${description}`).toBeTruthy();
    return this;
  }

  //ERROR ASSERTIONS

  /** Assert that response indicates an error. */
  expectErrorResponse(response: APIResponse, expectedStatus?: number) {
    expect(response.ok()).toBeFalsy();
    if (expectedStatus) {
      expect(response.status()).toBe(expectedStatus);
    } else {
      expect(response.status()).toBeGreaterThanOrEqual(400);
    }
    return this;
  }

  /** Assert 404 Not Found. */
  expectNotFound(response: APIResponse) {
    this.expectStatusCode(response, 404);
    return this;
  }

  /** Assert 400 Bad Request. */
  expectBadRequest(response: APIResponse) {
    this.expectStatusCode(response, 400);
    return this;
  }

  //FLUENT ASSERTION CHAINS

  /** Create a fluent assertion chain for Pet. */
  static forPet(pet: Pet) {
    const assertions = new PetStoreAssertions();
    assertions.expectValidPet(pet);

    const builder = {
      withStatus: (status: PetStatus) => {
        assertions.expectPetStatus(pet, status);
        return builder;
      },
      withName: (name: string) => {
        expect(pet.name, `Pet should have name "${name}"`).toBe(name);
        return builder;
      },
      withId: (id: number) => {
        expect(pet.id, `Pet should have ID ${id}`).toBe(id);
        return builder;
      },
      done: () => assertions,
    };

    return builder;
  }

  /** Create a fluent assertion chain for Order. */
  static forOrder(order: Order) {
    const assertions = new PetStoreAssertions();
    assertions.expectValidOrder(order);

    const builder = {
      withStatus: (status: OrderStatus) => {
        assertions.expectOrderStatus(order, status);
        return builder;
      },
      forPet: (petId: number) => {
        assertions.expectOrderForPet(order, petId);
        return builder;
      },
      withQuantity: (quantity: number) => {
        expect(order.quantity, `Order should have quantity ${quantity}`).toBe(quantity);
        return builder;
      },
      done: () => assertions,
    };

    return builder;
  }
}
