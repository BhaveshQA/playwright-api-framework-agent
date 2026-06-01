/**
 * ============================================
 * POSTMAN PARSER
 * ============================================
 *
 * PURPOSE:
 * Parse Postman collection dynamically
 * and extract:
 * - folders
 * - nested folders
 * - endpoints
 * - variables
 * - runtime intelligence
 *
 * OUTPUT:
 * Agent/output/postmanCollection.json
 *
 * ============================================
 */

import fs from 'fs';

import path from 'path';

// ============================================
// INPUT DIRECTORY
// ============================================

const inputDir = path.join(

  process.cwd(),

  'Agent',

  'input'

);

// ============================================
// VALIDATE INPUT DIRECTORY
// ============================================

if (

  !fs.existsSync(inputDir)

) {

  throw new Error(
    'Agent/input folder not found'
  );

}

// ============================================
// FIND POSTMAN COLLECTION
// ============================================

const postmanFile = fs

  .readdirSync(inputDir)

  .find(

    (file) =>

      file.endsWith(
        '.postman_collection.json'
      )

  );

// ============================================
// VALIDATE COLLECTION
// ============================================

if (

  !postmanFile

) {

  throw new Error(
    'No .postman_collection.json file found'
  );

}

// ============================================
// FILE PATH
// ============================================

const postmanCollectionPath = path.join(

  inputDir,

  postmanFile

);

// ============================================
// READ COLLECTION
// ============================================

const collection = JSON.parse(

  fs.readFileSync(

    postmanCollectionPath,

    'utf-8'

  )

);

// ============================================
// OUTPUT OBJECT
// ============================================

const parsedCollection = {

  frameworkExtensionMode: true,

  collectionName:
    collection.info?.name ||
    'Postman Collection',

  modules: []

};

// ============================================
// PROCESS COLLECTION
// ============================================

collection.item.forEach(

  (item) => {

    processFolder(item);

  }

);

// ============================================
// PROCESS FOLDER RECURSIVELY
// ============================================

function processFolder(

  folder,

  parentModule = null

) {

  // ==========================================
  // INVALID FOLDER
  // ==========================================

  if (

    !folder ||

    !folder.item

  ) {

    return;

  }

  // ==========================================
  // CREATE MODULE
  // ==========================================

  const module = {

    folderName:
      folder.name,

    endpoints: []

  };

  // ==========================================
  // PROCESS CHILD ITEMS
  // ==========================================

  folder.item.forEach(

    (item) => {

      // ======================================
      // NESTED FOLDER
      // ======================================

      if (

        item.item &&
        Array.isArray(item.item)

      ) {

        processNestedFolder(

          item,

          module

        );

      }

      // ======================================
      // DIRECT REQUEST
      // ======================================

      else if (

        item.request

      ) {

        const endpoint =
          buildEndpoint(item);

        if (endpoint) {

          module.endpoints.push(
            endpoint
          );

        }

      }

    }

  );

  // ==========================================
  // PUSH MODULE
  // ==========================================

  if (

    module.endpoints.length > 0

  ) {

    parsedCollection.modules.push(
      module
    );

  }

}

// ============================================
// PROCESS NESTED FOLDER
// ============================================

function processNestedFolder(

  nestedFolder,

  module

) {

  nestedFolder.item.forEach(

    (item) => {

      // ======================================
      // MORE NESTED
      // ======================================

      if (

        item.item &&
        Array.isArray(item.item)

      ) {

        processNestedFolder(

          item,

          module

        );

      }

      // ======================================
      // REQUEST
      // ======================================

      else if (

        item.request

      ) {

        const endpoint =
          buildEndpoint(item);

        if (endpoint) {

          module.endpoints.push(
            endpoint
          );

        }

      }

    }

  );

}

// ============================================
// BUILD ENDPOINT
// ============================================

function buildEndpoint(item) {

  const request =
    item.request;

  if (!request) {

    return null;

  }

  const rawUrl =
    request.url?.raw || '';

  // ==========================================
  // EXTRACT PATH
  // ==========================================

  const pathValue =
    extractPath(rawUrl);

  // ==========================================
  // VARIABLES
  // ==========================================

  const pathVariables =
    extractPathVariables(pathValue);

  const queryVariables =
    extractQueryVariables(rawUrl);

  const headerVariables =
    extractHeaderVariables(
      request.header || []
    );

  const bodyVariables =
    extractBodyVariables(
      request.body
    );

  // ==========================================
  // VARIABLES USED
  // ==========================================

  const variablesUsed = [

    ...pathVariables,

    ...queryVariables,

    ...headerVariables,

    ...bodyVariables

  ];

  // ==========================================
  // VARIABLE CLASSIFICATION
  // ==========================================

  const runtimeVariableClassification =
    classifyVariables(
      variablesUsed
    );

  // ==========================================
  // PAYLOAD
  // ==========================================

  let payload = null;

  if (request.body?.raw) {

    try {

      payload =
        JSON.parse(
          request.body.raw
        );

    }

    catch {

      payload =
        request.body.raw;

    }

  }

  // ==========================================
  // ENDPOINT OBJECT
  // ==========================================

  return {

    name:
      item.name,

    method:
      request.method,

    rawUrl,

    path:
      pathValue,

    headers:
      request.header || [],

    payload,

    requiresPayload:

      ['POST', 'PUT', 'PATCH']
        .includes(request.method),

    pathVariables,

    queryVariables,

    headerVariables,

    bodyVariables,

    variablesUsed,

    runtimeVariableClassification,

    statusAssertions: [200],

    testAssertions: [

      item.name,

      'Schema is valid'

    ]

  };

}

// ============================================
// EXTRACT PATH
// ============================================

function extractPath(rawUrl) {

  if (!rawUrl) {

    return '';

  }

  // ==========================================
  // REMOVE BASE URL
  // ==========================================

  let pathOnly = rawUrl.replace(

    /^{{.*?}}/,

    ''

  );

  // ==========================================
  // REMOVE QUERY PARAMS
  // ==========================================

  pathOnly =
    pathOnly.split('?')[0];

  return pathOnly;

}

// ============================================
// EXTRACT PATH VARIABLES
// ============================================

function extractPathVariables(pathValue) {

  const matches = [

    ...pathValue.matchAll(

      /\{\{(.*?)\}\}/g

    )

  ];

  return matches.map(

    (match) => match[1]

  );

}

// ============================================
// EXTRACT QUERY VARIABLES
// ============================================

function extractQueryVariables(rawUrl) {

  const queryPart =
    rawUrl.split('?')[1];

  if (!queryPart) {

    return [];

  }

  const matches = [

    ...queryPart.matchAll(

      /\{\{(.*?)\}\}/g

    )

  ];

  return [

    ...new Set(

      matches.map(

        (match) => match[1]

      )

    )

  ];

}

// ============================================
// EXTRACT HEADER VARIABLES
// ============================================

function extractHeaderVariables(headers) {

  const variables = [];

  headers.forEach(

    (header) => {

      const value =
        header.value || '';

      const matches = [

        ...value.matchAll(

          /\{\{(.*?)\}\}/g

        )

      ];

      matches.forEach(

        (match) => {

          variables.push(
            match[1]
          );

        }

      );

    }

  );

  return [...new Set(variables)];

}

// ============================================
// EXTRACT BODY VARIABLES
// ============================================

function extractBodyVariables(body) {

  if (!body?.raw) {

    return [];

  }

  const matches = [

    ...body.raw.matchAll(

      /\{\{(.*?)\}\}/g

    )

  ];

  return matches.map(

    (match) => match[1]

  );

}

// ============================================
// VARIABLE CLASSIFICATION
// ============================================

function classifyVariables(variables) {

  const classification = {};

  variables.forEach(

    (variable) => {

      const normalized =
        variable.toLowerCase();

      // ======================================
      // DYNAMIC DEVICE ID
      // ======================================

      if (

        normalized === 'deviceid' ||

        normalized === 'device-id'

      ) {

        classification[variable] =
          'dynamicGenerated';

      }

      // ======================================
      // FIXED DEVICE HEADER
      // ======================================

      else if (

        normalized === 'x-device-id'

      ) {

        classification[variable] =
          'environment';

      }

      // ======================================
      // DEFAULT ENVIRONMENT
      // ======================================

      else {

        classification[variable] =
          'environment';

      }

    }

  );

  return classification;

}

// ============================================
// OUTPUT DIRECTORY
// ============================================

const outputDir = path.join(

  process.cwd(),

  'Agent',

  'output'

);

if (

  !fs.existsSync(outputDir)

) {

  fs.mkdirSync(

    outputDir,

    { recursive: true }

  );

}

// ============================================
// WRITE OUTPUT
// ============================================

const outputFile = path.join(

  outputDir,

  'postmanCollection.json'

);

fs.writeFileSync(

  outputFile,

  JSON.stringify(

    parsedCollection,

    null,

    2

  )

);

// ============================================
// SUCCESS LOGS
// ============================================

console.log(
  '================================'
);

console.log(
  'POSTMAN PARSING COMPLETED'
);

console.log(
  '================================'
);

console.log(
  `Collection:
${parsedCollection.collectionName}`
);

console.log(
  `Modules:
${parsedCollection.modules.length}`
);

parsedCollection.modules.forEach(

  (module) => {

    console.log(
      `${module.folderName}:
${module.endpoints.length} endpoints`
    );

  }

);

console.log(
  `Output:
${outputFile}`
);

