import { APIRequestContext, APIResponse } from '@playwright/test';
import { Pet, PetStatus, Order } from '@models/api.types';

/** Generate a random pet name. */
export function generatePetName(prefix: string = 'TestPet'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/** Create a pet object with specified status. */
export function createPetObject(name: string, status: PetStatus): Pet {
  return {
    name: name,
    photoUrls: [`https://example.com/photos/${name}.jpg`],
    status: status,
    category: {
      id: 1,
      name: 'Dogs',
    },
    tags: [
      {
        id: 1,
        name: 'test',
      },
    ],
  };
}

/**
 * Wait for a specified amount of milliseconds
 * NOTE: While this is a generic utility better suited for a shared utils folder,
 * it's bundled here for simplicity and to keep all test helpers in one place.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Petstore API Actions
 * Pure API interaction methods without assertions
 */
export class PetStoreActions {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string = 'https://petstore.swagger.io/v2') {
    this.request = request;
    this.baseURL = baseURL;
  }

  /**
   * Create a new pet in the store
   * @param pet Pet object to create
   * @returns Created pet object and response
   */
  async createPet(pet: Pet): Promise<{ pet: Pet; response: APIResponse }> {
    const response = await this.request.post(`${this.baseURL}/pet`, {
      data: pet,
    });

    const petData = response.ok() ? await response.json() : null;
    return { pet: petData, response };
  }

  /**
   * Get pet by ID
   * @param petId Pet ID to retrieve
   * @returns Pet object and response
   */
  async getPetById(petId: number): Promise<{ pet: Pet; response: APIResponse }> {
    const response = await this.request.get(`${this.baseURL}/pet/${petId}`);
    const petData = response.ok() ? await response.json() : null;
    return { pet: petData, response };
  }

  /**
   * Find pets by status
   * @param status Pet status to filter by
   * @returns Array of pets and response
   */
  async findPetsByStatus(status: PetStatus): Promise<{ pets: Pet[]; response: APIResponse }> {
    const response = await this.request.get(`${this.baseURL}/pet/findByStatus`, {
      params: {
        status: status,
      },
    });

    const petsData = response.ok() ? await response.json() : [];
    return { pets: petsData, response };
  }

  /**
   * Update an existing pet
   * @param pet Pet object with updated data
   * @returns Updated pet object and response
   */
  async updatePet(pet: Pet): Promise<{ pet: Pet; response: APIResponse }> {
    const response = await this.request.put(`${this.baseURL}/pet`, {
      data: pet,
    });

    const petData = response.ok() ? await response.json() : null;
    return { pet: petData, response };
  }

  /**
   * Delete a pet by ID
   * @param petId Pet ID to delete
   * @returns Response object
   */
  async deletePet(petId: number): Promise<APIResponse> {
    return await this.request.delete(`${this.baseURL}/pet/${petId}`);
  }

  /**
   * Create a store order
   * @param order Order object to create
   * @returns Created order object and response
   */
  async createOrder(order: Order): Promise<{ order: Order; response: APIResponse }> {
    const response = await this.request.post(`${this.baseURL}/store/order`, {
      data: order,
    });

    const orderData = response.ok() ? await response.json() : null;
    return { order: orderData, response };
  }

  /**
   * Get order by ID
   * @param orderId Order ID to retrieve
   * @returns Order object and response
   */
  async getOrderById(orderId: number): Promise<{ order: Order; response: APIResponse }> {
    const response = await this.request.get(`${this.baseURL}/store/order/${orderId}`);
    const orderData = response.ok() ? await response.json() : null;
    return { order: orderData, response };
  }

  /**
   * Delete an order by ID
   * @param orderId Order ID to delete
   * @returns Response object
   */
  async deleteOrder(orderId: number): Promise<APIResponse> {
    return await this.request.delete(`${this.baseURL}/store/order/${orderId}`);
  }

  /**
   * Get store inventory
   * @returns Inventory object and response
   */
  async getInventory(): Promise<{ inventory: Record<string, number>; response: APIResponse }> {
    const response = await this.request.get(`${this.baseURL}/store/inventory`);
    const inventoryData = response.ok() ? await response.json() : {};
    return { inventory: inventoryData, response };
  }
}
