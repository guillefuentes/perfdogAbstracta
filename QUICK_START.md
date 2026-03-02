# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Run Tests
```bash
npm test
```

### 3. View Results
```bash
npm run report
```

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:part1` | Run Part 1 tests only |
| `npm run test:part2` | Run Part 2 tests only |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:headed` | Run tests with browser visible |
| `npm run report` | Open HTML test report |

## 🧪 Test Scenarios Covered

### Part 1: Pet Management
- Creates 10 pets with different statuses
- Retrieves and validates pet details
- Verifies data integrity

### Part 2: Order Creation
- Lists available pets from API
- Stores pets in data structure
- Creates orders for selected pets
- Validates order creation

## 📖 API Examples

### Creating a Pet
```typescript
const api = new PetStoreAPI(request);
const pet = createPetObject('MyPet', 'available');
const createdPet = await api.createPet(pet);
```

### Finding Pets by Status
```typescript
const availablePets = await api.findPetsByStatus('available');
```

### Creating an Order
```typescript
const order: Order = {
  petId: 123,
  quantity: 1,
  status: 'placed',
  complete: false
};
const createdOrder = await api.createOrder(order);
```

## 🔧 Customization

### Modify Base URL
Edit `playwright.config.ts`:
```typescript
use: {
  baseURL: 'https://your-api-url.com',
}
```

### Adjust Timeouts
Edit `playwright.config.ts`:
```typescript
timeout: 90000, // 90 seconds
```

### Change Workers
Edit `playwright.config.ts`:
```typescript
workers: 2, // Run tests in parallel
```

## 📊 Understanding Test Output

### Success Indicators
- ✓ Green checkmarks indicate successful steps
- Detailed console logs show progress
- Summary appears at the end of each test

### Expected Behavior
- Some cleanup failures are normal (demo API limitation)
- IDs may show as `9223372036854776000` (MAX_SAFE_INTEGER)
- Order IDs may be duplicates (demo API behavior)

## 🐛 Troubleshooting

### Tests Timeout
- Check internet connection
- Increase timeout in `playwright.config.ts`

### API Errors
- The demo API may be down - check https://petstore.swagger.io
- Rate limiting - tests include automatic delays

### Installation Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npx playwright install
```

## 💡 Tips

1. **Run tests individually first** to isolate any issues
2. **Check HTML reports** for detailed execution traces
3. **Use debug mode** (`--debug`) to step through tests
4. **Review console logs** for detailed API interactions

## 📞 Support

For issues or questions:
1. Check the [README.md](README.md) for detailed documentation
2. Review [TEST_SUMMARY.md](TEST_SUMMARY.md) for test architecture
3. Examine test files directly for implementation details

## 🎯 Next Steps

- Add more test scenarios
- Implement data-driven testing
- Add performance metrics
- Integrate with CI/CD pipeline
- Add custom reporters
