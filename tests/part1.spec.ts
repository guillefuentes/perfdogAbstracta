import { test, generatePetName, createPetObject, delay } from '../fixtures/ActionsAndAssertions';
import { Pet } from '@models/api.types';

type Summary = {
  total: number;
  createdPets: Array<{
    id?: number;
    name?: string;
    status?: string;
  }>;
};

test.describe('Petstore API - Mandatory Test #1', () => {
  let lastSummary: Summary | null = null;

  test.afterEach(async ({}, testInfo) => {
    if (!lastSummary) return;

    const payload = {
      test: testInfo.titlePath.join(' > '),
      totalCreated: lastSummary.total,
      availablePets: lastSummary.createdPets.filter(pet => pet.status === 'available'),
      pendingPets: lastSummary.createdPets.filter(pet => pet.status === 'pending'),
      soldPets: lastSummary.createdPets.filter(pet => pet.status === 'sold'),
    };

    console.log(`TEST_SUMMARY:${JSON.stringify(payload)}`);
    lastSummary = null;
  });

  test('Create Pets and Retrieve Sold Pet', async ({ actions, assert }) => {
    const createdPetIds: number[] = [];
    const createdPets: Array<{ id?: number; name?: string; status?: string }> = [];
    let soldPet: Pet;

    await test.step('Create 5 pets with status "available"', async () => {
      console.log('\n=== Creating 5 pets with status "available" ===');

      for (let i = 1; i <= 5; i++) {
        const petName = generatePetName(`Available_Pet_${i}`);
        const petData = createPetObject(petName, 'available');
        const { pet: createdPet, response } = await actions.createPet(petData);

        await test.step(`Verify pet ${i}/5 was created successfully`, async () => {
          assert.expectSuccessfulResponse(response);
          assert.expectValidPet(createdPet);
          assert.expectPetToHave(createdPet, { name: petName, status: 'available' });
        });

        await test.step(`Save pet ${i}/5 ID`, async () => {
            createdPetIds.push(createdPet.id!);
            createdPets.push({ id: createdPet.id, name: createdPet.name, status: createdPet.status });
            console.log(`✓ Created pet ${i}/5: ${petName} (ID: ${createdPet.id})`);
            await delay(100);
        });
      }
      console.log(`Total available pets created: 5`);
    });

    await test.step('Create 4 pets with status "pending"', async () => {
      console.log('\n=== Creating 4 pets with status "pending" ===');

      for (let i = 1; i <= 4; i++) {
        const petName = generatePetName(`Pending_Pet_${i}`);
        const petData = createPetObject(petName, 'pending');

        const { pet: createdPet, response } = await actions.createPet(petData);

        await test.step(`Verify pet ${i}/4 was created successfully`, async () => {
          assert.expectSuccessfulResponse(response);
          assert.expectValidPet(createdPet);
          assert.expectPetStatus(createdPet, 'pending');
        });

        await test.step(`Save pet ${i}/4 ID`, async () => {
          createdPetIds.push(createdPet.id!);
          createdPets.push({ id: createdPet.id, name: createdPet.name, status: createdPet.status });
          console.log(`✓ Created pet ${i}/4: ${petName} (ID: ${createdPet.id})`);
          await delay(100);
        });
      }

      console.log(`Total pending pets created: 4`);
    });

    await test.step('Create 1 pet with status "sold"', async () => {
      console.log('\n=== Creating 1 pet with status "sold" ===');

      const petName = generatePetName('Sold_Pet');
      const petData = createPetObject(petName, 'sold');

      const { pet: createdPet, response } = await actions.createPet(petData);
      soldPet = createdPet;

      await test.step('Verify sold pet was created successfully', async () => {
        assert.expectSuccessfulResponse(response);
        assert.expectValidPet(soldPet);
        assert.expectPetToHave(soldPet, { name: petName, status: 'sold' });
      });

      await test.step('Save sold pet ID', async () => {
        createdPetIds.push(soldPet.id!);
        createdPets.push({ id: soldPet.id, name: soldPet.name, status: soldPet.status });
        console.log(`✓ Created pet: ${petName} (ID: ${soldPet.id})`);
        console.log(`Total sold pets created: 1`);
      });
    });

    await test.step('Retrieve details of the sold pet', async () => {
      console.log('\n=== Retrieving details of the sold pet ===');

      // NOTE: The Petstore demo API has issues with large IDs (returns MAX_SAFE_INTEGER)
      // So we'll verify by searching for sold pets and finding ours by name
      const { pets: soldPets, response } = await actions.findPetsByStatus('sold');

      await test.step('Verify sold pet retrieval', async () => {
        await test.step('Verify response', async () => {
            assert.expectValidPet(soldPet);
            assert.expectSuccessfulResponse(response);
            assert.expectNotEmpty(soldPets, 'Sold pets');
        });

        const retrievedPet = soldPets.find(p => p.name === soldPet.name);

        await test.step('Verify sold pet details', async () => {
            assert.expectDefined(retrievedPet, 'Should find the sold pet by name');
            assert.expectPetToHave(retrievedPet!, { name: soldPet.name, status: 'sold' });
            //Fluent assertion example for retrieved pet details
            assert.fluent.forPet(retrievedPet!).withName(soldPet.name).withStatus('sold');
        });
      });

        await test.step('Print sold pet details', async () => {
            const retrievedPet = soldPets.find(p => p.name === soldPet.name);
            console.log(`✓ Successfully retrieved sold pet details:`);
            console.log(`  - ID: ${retrievedPet?.id}`);
            console.log(`  - Name: ${retrievedPet?.name}`);
            console.log(`  - Status: ${retrievedPet?.status}`);
            console.log(`  - Photo URLs: ${retrievedPet?.photoUrls?.join(', ')}`);

            if (retrievedPet?.category) console.log(`  - Category: ${retrievedPet.category.name}`);
            if (retrievedPet?.tags && retrievedPet.tags.length > 0) console.log(`  - Tags: ${retrievedPet.tags.map(t => t.name).join(', ')}`);
        });
    });

    lastSummary = {
      total: createdPetIds.length,
      createdPets: [...createdPets],
    };

    await test.step('Cleanup created pets', async () => {
      console.log(`\n=== Cleaning up ${createdPetIds.length} pets ===`);

      const uniqueIds = [...new Set(createdPetIds)];

      for (const petId of uniqueIds) {
        try {
          const response = await actions.deletePet(petId);
          if (response.ok()) {
            console.log(`✓ Deleted pet with ID: ${petId}`);
          } else {
            console.log(`Note: Could not delete pet ${petId} (this is expected with the demo API)`);
          }
        } catch (_error) {
          console.log(`Note: Could not delete pet ${petId} (this is expected with the demo API)`);
        }
      }
    });
  });
});
