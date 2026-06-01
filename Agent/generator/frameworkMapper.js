/**
 * ============================================
 * FRAMEWORK MAPPER
 * ============================================
 *
 * PURPOSE:
 * Convert Postman collection into
 * framework-aligned generation map.
 *
 * INPUT:
 * - frameworkSummary.json
 * - postmanCollection.json
 *
 * OUTPUT:
 * - frameworkMap.json
 *
 * ============================================
 */

import fs from 'fs';

import path from 'path';

// ============================================
// INPUT FILES
// ============================================

const summaryPath = path.join(

  process.cwd(),

  'Agent',

  'output',

  'frameworkSummary.json'

);

const postmanPath = path.join(

  process.cwd(),

  'Agent',

  'output',

  'postmanCollection.json'

);

// ============================================
// VALIDATE FILES
// ============================================

if (

  !fs.existsSync(summaryPath)

) {

  throw new Error(
    'frameworkSummary.json not found'
  );

}

if (

  !fs.existsSync(postmanPath)

) {

  throw new Error(
    'postmanCollection.json not found'
  );

}

// ============================================
// READ FILES
// ============================================

const frameworkSummary =
  JSON.parse(

    fs.readFileSync(

      summaryPath,

      'utf-8'

    )

  );

const postmanCollection =
  JSON.parse(

    fs.readFileSync(

      postmanPath,

      'utf-8'

    )

  );

// ============================================
// GENERATION STRATEGY
// ============================================

const generationStrategy =
  frameworkSummary.generationStrategy;

// ============================================
// FRAMEWORK MAP
// ============================================

const frameworkMap = {

  frameworkIdentity:
    frameworkSummary.frameworkIdentity,

  generationStrategy,

  modules: []

};

// ============================================
// PROCESS MODULES
// ============================================

postmanCollection.modules.forEach(

  (module) => {

    const moduleName =
      sanitizeName(
        module.folderName
      );

    const serviceName =
      `${moduleName}Service`;

    const mappedModule = {

      moduleName,

      serviceName,

      servicePath:
        `services/${serviceName}.js`,

      testPath:
        `tests/${moduleName}`,

      payloadPath:
        `payloads/${moduleName}`,

      endpoints: [],

      payloads: []

    };

    // ========================================
    // PROCESS ENDPOINTS
    // ========================================

    module.endpoints.forEach(

      (endpoint) => {

        const endpointName =
          endpoint.name;

        const methodName =
          generateMethodName(
            endpointName
          );

        const endpointConstant =
          generateEndpointConstant(
            endpointName
          );

        // ====================================
        // EXTRACT PATH VARIABLES
        // ====================================

        const pathVariables =
          extractPathVariables(
            endpoint.path
          );

        // ====================================
        // QUERY VARIABLES
        // ====================================

        const queryVariables =
          endpoint.queryVariables || [];

        // ====================================
        // HEADER VARIABLES
        // ====================================

        const headerVariables =
          endpoint.headerVariables || [];

        // ====================================
        // RUNTIME VARIABLE TYPES
        // ====================================

        const runtimeVariableClassification =
          endpoint.runtimeVariableClassification || {};

        // ====================================
        // BUILD METHOD ARGUMENTS
        // ====================================

        const methodArguments = [

          'request'

        ];

        // ====================================
        // PATH VARIABLES
        // ====================================

        pathVariables.forEach(

          (variable) => {

            methodArguments.push(
              variable
            );

          }

        );

        // ====================================
        // QUERY VARIABLES
        // ====================================

        queryVariables.forEach(

          (variable) => {

            if (

              !methodArguments.includes(
                variable
              )

            ) {

              methodArguments.push(
                variable
              );

            }

          }

        );

        // ====================================
        // PAYLOAD SUPPORT
        // ====================================

        const requiresPayload =

          ['POST', 'PUT', 'PATCH']
            .includes(
              endpoint.method
            );

        if (

          requiresPayload

        ) {

          methodArguments.push(
            'payload'
          );

        }

        // ====================================
        // CONVERT POSTMAN VARIABLES
        // ====================================

        const normalizedPath =
          endpoint.path.replace(

            /\{\{(.*?)\}\}/g,

            '${$1}'

          );

        // ====================================
        // DYNAMIC VARIABLES
        // ====================================

        const dynamicRuntimeVariables =

          Object.entries(
            runtimeVariableClassification
          )

          .filter(

            ([, type]) =>

              type ===
              'dynamicGenerated'

          )

          .map(

            ([variable]) => variable

          );

        // ====================================
        // MAPPED ENDPOINT
        // ====================================

        const mappedEndpoint = {

          endpointName,

          methodName,

          endpointConstant,

          method:
            endpoint.method,

          path:
            normalizedPath,

          pathVariables,

          queryVariables,

          headerVariables,

          runtimeVariableClassification,

          dynamicRuntimeVariables,

          methodArguments,

          requiresPayload,

          payload:
            endpoint.payload || null,

          statusAssertions:
            endpoint.statusAssertions || [200],

          testAssertions:
            endpoint.testAssertions || []

        };

        mappedModule.endpoints.push(
          mappedEndpoint
        );

        // ====================================
        // PAYLOAD MAPPING
        // ====================================

        if (

          requiresPayload &&
          endpoint.payload

        ) {

          mappedModule.payloads.push({

            payloadBuilder:
              `build${methodName
                .charAt(0)
                .toUpperCase()}${methodName
                .slice(1)}Payload`,

            originalPayload:
              endpoint.payload

          });

        }

      }

    );

    frameworkMap.modules.push(
      mappedModule
    );

  }

);

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

  'frameworkMap.json'

);

fs.writeFileSync(

  outputFile,

  JSON.stringify(

    frameworkMap,

    null,

    2

  )

);

// ============================================
// METHOD NAME
// ============================================

function generateMethodName(name) {

  return name

    .replace(/[^\w\s]/g, '')

    .split(' ')

    .map((word, index) => {

      if (index === 0) {

        return word.toLowerCase();

      }

      return (

        word.charAt(0)
          .toUpperCase() +

        word.slice(1)

      );

    })

    .join('');

}

// ============================================
// ENDPOINT CONSTANT
// ============================================

function generateEndpointConstant(name) {

  return name

    .replace(/[^\w]/g, '_')

    .replace(/_+/g, '_')

    .toUpperCase();

}

// ============================================
// SANITIZE MODULE NAME
// ============================================

function sanitizeName(name) {

  return name

    .replace(/[^\w\s]/g, '')

    .replace(/\s+/g, '');

}

// ============================================
// EXTRACT PATH VARIABLES
// ============================================

function extractPathVariables(pathValue) {

  const variables = [];

  // ========================================
  // SUPPORT ${variable}
  // ========================================

  const templateMatches =

    [...pathValue.matchAll(

      /\$\{(.*?)\}/g

    )];

  templateMatches.forEach(

    (match) => {

      variables.push(match[1]);

    }

  );

  // ========================================
  // SUPPORT {{variable}}
  // ========================================

  const postmanMatches =

    [...pathValue.matchAll(

      /\{\{(.*?)\}\}/g

    )];

  postmanMatches.forEach(

    (match) => {

      variables.push(match[1]);

    }

  );

  return [...new Set(variables)];

}

// ============================================
// SUCCESS LOGS
// ============================================

console.log(
  '================================'
);

console.log(
  'FRAMEWORK MAPPING COMPLETED'
);

console.log(
  '================================'
);

console.log(
  `Modules:
${frameworkMap.modules.length}`
);

console.log(
  `Output:
${outputFile}`
);

