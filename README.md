````md id="readme92"
# Playwright API Framework Agent

![Playwright](https://img.shields.io/badge/Playwright-API_Testing-green?logo=playwright)
![Node.js](https://img.shields.io/badge/Node.js-JavaScript-yellow?logo=node.js)
![Automation](https://img.shields.io/badge/Automation-Agent-blue)
![Status](https://img.shields.io/badge/Status-Active-success)
![Architecture](https://img.shields.io/badge/Architecture-Framework_Aware-orange)

Framework-aware intelligent API automation agent built using Playwright + JavaScript.

This project combines:
- Existing Playwright API automation framework
- Postman collection parsing
- Framework analysis
- Intelligent code generation
- Runtime variable understanding
- Dynamic endpoint generation

The goal of this project is to automatically extend an existing automation framework by studying its architecture and generating framework-aligned automation code.

---

# Technology Stack

- Playwright
- JavaScript (ES Modules)
- Node.js
- REST API Testing
- Postman Collection Parsing
- Intelligent Code Generation
- Framework Analysis Engine

---

# Existing Framework Flow

The existing framework follows a layered API automation architecture.

```text
Tests
  ↓
Services
  ↓
API Client
  ↓
API Endpoints
  ↓
Playwright Request Context
````

## Framework Layers

### Tests Layer

Responsible for:

* test execution
* assertions
* payload usage
* response validation

### Services Layer

Responsible for:

* endpoint execution
* request preparation
* dynamic parameter handling
* API abstraction

### API Client Layer

Responsible for:

* Playwright request handling
* common headers
* token management
* response handling

### Config Layer

Responsible for:

* centralized endpoint management
* reusable endpoint constants

### Utility Layer

Responsible for:

* assertions
* runtime utilities
* dynamic deviceId generation
* reusable helper functions

---

# Agent Workflow

The agent follows a multi-stage intelligent generation pipeline.

```text
Framework Analyzer
        ↓
Framework Summary
        ↓
Postman Parser
        ↓
Framework Mapper
        ↓
Code Generator
        ↓
Generated Playwright Framework Code
```

---

# Agent Components

## 1. Framework Analyzer

Studies the existing framework and extracts:

* folder structure
* architecture style
* service patterns
* test patterns
* payload handling
* endpoint management strategy
* runtime conventions

Output:

```text
frameworkSummary.json
```

---

## 2. Postman Parser

Parses Postman collections dynamically and extracts:

* endpoints
* nested folder structures
* query params
* path variables
* payloads
* runtime dependencies
* variable intelligence

Output:

```text
postmanCollection.json
```

---

## 3. Framework Mapper

Maps:

* framework intelligence
  with
* Postman intelligence

Creates framework-aligned generation strategy.

Output:

```text
frameworkMap.json
```

---

## 4. Code Generator

Generates:

* services
* tests
* payload builders
* endpoint constants

while preserving:

* existing framework architecture
* coding conventions
* service signatures
* runtime behavior

---

# Runtime Intelligence

The agent can identify:

## Dynamic Runtime Variables

Example:

```text
deviceId
```

Automatically generated at runtime using utility functions.

---

## Environment Variables

Example:

```text
x-device-id
eventId
apiKey
```

Resolved using:

```text
.env
```

---

# Features

* Framework-aware generation
* Nested Postman folder support
* Dynamic endpoint parsing
* Runtime variable intelligence
* Query parameter generation
* Path variable replacement
* Payload generation
* Assertion generation
* Service generation
* Test generation
* Centralized endpoint management
* Existing framework preservation

---

# Sample Generated Flow

```text
Postman Collection
        ↓
Parser extracts intelligence
        ↓
Mapper aligns with framework
        ↓
Generator creates Playwright code
        ↓
Generated API tests run successfully
```

---

# Environment Setup

Create:

```text
.env
```

Example:

```env
BASE_URL=https://your-api-url.com

EVENT_ID=sample-event-id

X_API_KEY=your-api-key

X_DEVICE_ID=sample-device-id
```

---

# Installation

```bash
npm install
```

---

# Run Agent

```bash
node Agent/runAgent.js
```

---

# Run Playwright Tests

```bash
npx playwright test
```

---

# Future Enhancements

* Multi-framework support
* Runtime dependency chaining
* Schema generation
* AI-assisted framework analysis
* Smart payload mutation
* Response-based test generation
* Auth workflow intelligence
* Collection dependency graphs

---

# Current Status

Current version is optimized for:

* existing Playwright API automation framework
* framework-aware code generation

The architecture is intentionally modular to support future multi-framework adaptability.

---

# Author

Bhavesh Rathod

```
```
