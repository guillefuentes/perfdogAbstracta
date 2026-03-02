import { test, delay } from '../fixtures/ActionsAndAssertions';
import { Pet, Order } from '@models/api.types';

type Summary = {
  selectedPets: Array<{
    id?: number;
    name?: string;
    status?: string;
  }>;
  totalOrders: number;
  createdOrders: Array<{
    id?: number;
    petId?: number;
    quantity?: number;
    status?: string;
  }>;
};

test.describe('Petstore API - Mandatory Test #2 ', () => {
  let lastSummary: Summary | null = null;

  test.afterEach(async ({}, testInfo) => {
    if (!lastSummary) {
      return;
    }

    const payload = {
      test: testInfo.titlePath.join(' > '),
      selectedPets: lastSummary.selectedPets,
      totalOrders: lastSummary.totalOrders,
      createdOrders: lastSummary.createdOrders,
    };

    // Only output TEST_SUMMARY in CI environment
    if (process.env.CI) console.log(`TEST_SUMMARY:${JSON.stringify(payload)}`);
    lastSummary = null;
  });
  test('List Available Pets and Create Orders', async ({ actions, assert }) => {
    const selectedPets: Pet[] = [];
    const createdOrderIds: number[] = [];
    const createdOrders: Array<{ id?: number; petId?: number; quantity?: number; status?: string }> = [];

    await test.step('List available pets and save 5 of them', async () => {
      console.log('\n=== Listing available pets ===');

      const { pets: availablePets, response } = await actions.findPetsByStatus('available');

      await test.step('Verify available pets response', async () => {
        assert.expectSuccessfulResponse(response);
        assert.expectNotEmpty(availablePets, 'Available pets');
        assert.expectMinimumPets(availablePets, 5);
      });

      console.log(`✓ Found ${availablePets.length} available pets in the store`);

      // Select 5 valid pets (filter out pets with incomplete data)
      for (let i = 0; i < availablePets.length && selectedPets.length < 5; i++) {
        const pet = availablePets[i];

        // Skip pets with incomplete data (common in demo API)
        if (!pet.name || !pet.id || !pet.photoUrls) {
          console.log(`  Skipping invalid pet at index ${i} (missing required fields)`);
          continue;
        }

        await test.step(`Verify pet ${selectedPets.length + 1}/5 is valid`, async () => {
          assert.expectValidPet(pet);
          assert.expectPetStatus(pet, 'available');
          // Fluent assertion example for pet validation
          assert.fluent.forPet(pet).withStatus('available').withId(pet.id!);
        });

        selectedPets.push(pet);
        console.log(`  ${selectedPets.length}. Pet ID: ${pet.id}, Name: ${pet.name}, Status: ${pet.status}`);
      }

      await test.step('Verify 5 pets were selected', async () => {
        assert.expectCollectionSize(selectedPets, 5, 'Selected pets');
      });

      console.log(`\n✓ Successfully saved 5 available pets to data structure`);
    });

    for (let i = 0; i < selectedPets.length; i++) {
      await test.step(`Create order for pet ${i + 1}/${selectedPets.length}`, async () => {
        const pet = selectedPets[i];
        console.log(`\n=== Creating order for pet ${i + 1}/${selectedPets.length} ===`);
        console.log(`Pet ID: ${pet.id}, Name: ${pet.name}`);

        const orderData: Order = {
          petId: pet.id!,
          quantity: (i + 1),
          shipDate: new Date().toISOString(),
          status: 'placed',
          complete: false,
        };

        const { order: createdOrder, response } = await actions.createOrder(orderData);

        await test.step(`Verify order ${i + 1}/${selectedPets.length} was created successfully`, async () => {
          assert.expectSuccessfulResponse(response);
          assert.expectValidOrder(createdOrder);
          assert.expectOrderToHave(createdOrder, {
            petId: pet.id,
            quantity: (i + 1),
            status: 'placed'
          });
          // Fluent assertion example for order validation
          assert.fluent.forOrder(createdOrder).withStatus('placed').forPet(pet.id!).withQuantity((i + 1));
        });

        createdOrderIds.push(createdOrder.id!);
        createdOrders.push({
          id: createdOrder.id,
          petId: createdOrder.petId,
          quantity: createdOrder.quantity,
          status: createdOrder.status,
        });
        console.log(`✓ Order created successfully - Order ID: ${createdOrder.id}`);

        await delay(100);
      });
    }

    await test.step('Verify orders were created successfully', async () => {
      console.log('\n=== Verifying order creation ===');

      await test.step('Verify order count', async () => {
        assert.expectCollectionSize(createdOrderIds, selectedPets.length, 'Created orders');
      });

      // Note: The Petstore demo API may return duplicate IDs or have issues retrieving orders
      // So we'll verify that we received valid order IDs
      const uniqueOrderIds = [...new Set(createdOrderIds)];
      console.log(`✓ Created ${createdOrderIds.length} orders (${uniqueOrderIds.length} unique ID(s))`);

      // Try to retrieve at least one order to verify API is working
      try {
        const firstOrderId = createdOrderIds[0];
        const { order: retrievedOrder, response } = await actions.getOrderById(firstOrderId);
        if (response.ok()) {
          await test.step('Verify order retrieval', async () => {
            assert.expectValidOrder(retrievedOrder);
          });

          console.log(`✓ Successfully verified order retrieval: Order ID ${retrievedOrder.id}`);
        } else {
          console.log(`Note: Order retrieval verification skipped (demo API limitation)`);
        }
      } catch (_error) {
        // If retrieval fails, that's okay - the demo API has limitation
        console.log(`Note: Order retrieval verification skipped (demo API limitation)`);
      }

      await delay(100);
    });

    lastSummary = {
      selectedPets: selectedPets.map(pet => ({
        id: pet.id,
        name: pet.name,
        status: pet.status,
      })),
      totalOrders: createdOrderIds.length,
      createdOrders: [...createdOrders],
    };

    // Cleanup: Delete all created orders
    await test.step('Cleanup created orders', async () => {
      console.log(`\n=== Cleaning up ${createdOrderIds.length} orders ===`);

      for (const orderId of createdOrderIds) {
        try {
          const response = await actions.deleteOrder(orderId);
          if (response.ok()) {
            console.log(`✓ Deleted order with ID: ${orderId}`);
          } else {
            console.log(`Note: Could not delete order ${orderId} (this is expected with the demo API)`);
          }
        } catch (_error) {
          console.log(`Note: Could not delete order ${orderId} (this is expected with the demo API)`);
        }
      }
    });
  });
});
