# Petstore API Testing Framework

Professional API testing framework built with Playwright, demonstrating advanced patterns including separation of concerns, custom assertions, and fluent API design.

## Getting Started

**📖 For complete documentation on framework architecture, patterns, and best practices, see [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)**

Follow these steps to set up and run tests quickly:

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 2. Install Dependencies

Clone the repository and install all required packages:

```bash
cd perfdog
npm install
```

### 3. Install Playwright

Playwright is included in dependencies. After `npm install`, you're ready to run API tests.

For more details, see the Playwright documentation: https://playwright.dev/

## Run Tests

Run all tests:

```bash
npm test
```

Run specific test suite:

```bash
npm test part1.spec.ts          # Part 1: Create 10 pets workflow
npm test part2.spec.ts          # Part 2: List pets and create orders
npm test assertions.demo.spec.ts # Showcase of advanced patterns
```

Open the last HTML report:

```bash
npx playwright show-report
```

Run with detailed output:

```bash
npm test -- --reporter=list
```

## Key Features

### 🏗️ **Separation of Concerns**
- **Actions Layer**: Pure API interaction methods
- **Assertions Layer**: Domain-specific custom validations
- **Tests**: Clean orchestration of actions and assertions

### 🎨 **Fluent API Pattern**
```typescript
PetStoreAssertions
  .forPet(pet)
  .withStatus('available')
  .withName('Fluffy');
```

### ✅ **Multiple Assertion Styles**
- Method chaining for concise validations
- Fluent builder API for maximum readability
- Domain-specific assertions for business logic

### 🔒 **Full Type Safety**
- Complete TypeScript implementation
- IDE auto-completion support
- Compile-time error detection

## API Endpoint

All tests target the Petstore Swagger API:
- **Base URL**: `https://petstore.swagger.io/v2`
- **Documentation**: https://petstore.swagger.io/

## Test Coverage

Currently includes:
- ✅ **Part 1**: Create 10 pets with different statuses, retrieve sold pet
- ✅ **Part 2**: List available pets, create 5 orders

## Known API Limitations

The demo Petstore API has some quirks:
- Returns `MAX_SAFE_INTEGER` (9223372036854776000) for all pet/order IDs
- Order retrieval by ID often returns 404
- Pet deletion may not work consistently

The framework handles these gracefully with try-catch blocks and appropriate logging.

## Contributing

To extend the framework:

1. **Add new API method** in `actions/petstore.actions.ts`
2. **Add custom assertion** in `apiAssertions/petstore.assertions.ts` (optional)
3. **Write test** using the new action and assertion

The architecture makes it trivial to scale!

## License

This project is for demonstration purposes.