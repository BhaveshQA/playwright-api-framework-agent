/**
 * ============================================
 * CODE GENERATOR
 * ============================================
 *
 * PURPOSE:
 * Generate framework-aligned code
 * from frameworkMap.json
 *
 * INPUT:
 * Agent/output/frameworkMap.json
 *
 * OUTPUT:
 * - services
 * - tests
 * - payloads
 * - apiEndpoints.js update
 *
 * ============================================
 */

import fs from 'fs';

import path from 'path';

// ============================================
// INPUT FILE
// ============================================

const frameworkMapPath = path.join(

  process.cwd(),

  'Agent',

  'output',

  'frameworkMap.json'

);

// ============================================
// VALIDATE FILE
// ============================================

if (

  !fs.existsSync(frameworkMapPath)

) {

  throw new Error(
    'frameworkMap.json not found'
  );

}

// ============================================
// READ FRAMEWORK MAP
// ============================================

const frameworkMap =
  JSON.parse(

    fs.readFileSync(

      frameworkMapPath,

      'utf-8'

    )

  );

// ============================================
// PROCESS MODULES
// ============================================

frameworkMap.modules.forEach(

  (module) => {

    updateApiEndpoints(module);

    generateService(module);

    generateTests(module);

    generatePayloads(module);

  }

);

// ============================================
// UPDATE API ENDPOINTS
// ============================================


function updateApiEndpoints(module) {

  const endpointFile = path.join(

    process.cwd(),

    'config',

    'apiEndpoints.js'

  );

  // ==========================================
  // VALIDATE FILE
  // ==========================================

  if (

    !fs.existsSync(endpointFile)

  ) {

    console.log(
      'apiEndpoints.js not found'
    );

    return;

  }

  // ==========================================
  // READ CONTENT
  // ==========================================

  let endpointContent =

    fs.readFileSync(

      endpointFile,

      'utf-8'

    );

  // ==========================================
  // PROCESS ENDPOINTS
  // ==========================================

  module.endpoints.forEach(

    (endpoint) => {

      // ======================================
      // SKIP DUPLICATE
      // ======================================

      if (

        endpointContent.includes(

          `${endpoint.endpointConstant}:`

        )

      ) {

        return;

      }

      // ======================================
      // FIND LAST PROPERTY
      // ======================================

      endpointContent = endpointContent.replace(

        /([^,\s])(\s*\n\s*};)/,

        '$1,$2'

      );

      // ======================================
      // NEW ENDPOINT ENTRY
      // ======================================

      const endpointEntry =

`
  ${endpoint.endpointConstant}:
    '${endpoint.path}'
`;

      // ======================================
      // INSERT BEFORE };
      // ======================================

      endpointContent =

        endpointContent.replace(

          /};\s*$/,

          `${endpointEntry}

};`

        );

      console.log(
        `Added Endpoint:
${endpoint.endpointConstant}`
      );

    }

  );

  // ==========================================
  // WRITE FILE
  // ==========================================

  fs.writeFileSync(

    endpointFile,

    endpointContent

  );

}



// ============================================
// GENERATE SERVICE
// ============================================

function generateService(module) {

  const servicePath = path.join(

    process.cwd(),

    module.servicePath

  );

  // ==========================================
  // CREATE FILE
  // ==========================================

  if (

    !fs.existsSync(servicePath)

  ) {

    const initialContent =

`import { apiRequest } from '../utils/apiClient.js';

import { API_ENDPOINTS } from '../config/apiEndpoints.js';

export class ${module.serviceName} {

}
`;

    fs.writeFileSync(

      servicePath,

      initialContent

    );

  }

  // ==========================================
  // READ FILE
  // ==========================================

  let serviceContent =

    fs.readFileSync(

      servicePath,

      'utf-8'

    );

  // ==========================================
  // PROCESS ENDPOINTS
  // ==========================================

  module.endpoints.forEach(

    (endpoint) => {

      if (

        serviceContent.includes(

          `async ${endpoint.methodName}`

        )

      ) {

        return;

      }

      // ======================================
      // METHOD PARAMETERS
      // ======================================

      const methodParams =
        endpoint.methodArguments.join(
          ', '
        );

      // ======================================
      // ENDPOINT LOGIC
      // ======================================

      let endpointLogic =

`
    const endpoint =
      API_ENDPOINTS.${endpoint.endpointConstant};
`;

      // ======================================
      // PATH VARIABLE REPLACEMENT
      // ======================================

      if (

        endpoint.pathVariables.length > 0

      ) {

        endpointLogic =

`
    const endpoint =
      API_ENDPOINTS.${endpoint.endpointConstant}

${endpoint.pathVariables.map(

  (variable) =>

`        .replace(
          '\${${variable}}',
          ${variable}
        )`

).join('\n')};
`;

      }

      // ======================================
      // QUERY PARAMS
      // ======================================

      let queryParamBlock = '';

      if (

        endpoint.queryVariables.length > 0

      ) {

        const queryParams =

          endpoint.queryVariables.map(

            (variable) =>

`${variable}`

          ).join(',\n          ');

        queryParamBlock =

`
      {
        params: {
          ${queryParams}
        }
      }
`;

      }

      // ======================================
      // API REQUEST
      // ======================================

      let requestStatement =

`
    return await apiRequest(

      request,

      '${endpoint.method}',

      endpoint${queryParamBlock ? ',' : ''}

${queryParamBlock}

    );
`;

      // ======================================
      // PAYLOAD SUPPORT
      // ======================================

      if (

        endpoint.requiresPayload

      ) {

        requestStatement =

`
    return await apiRequest(

      request,

      '${endpoint.method}',

      endpoint,

      {
        data: payload
      }

    );
`;

      }

      // ======================================
      // METHOD TEMPLATE
      // ======================================

      const methodTemplate =

`
  // ============================================
  // ${endpoint.endpointName}
  // ============================================

  async ${endpoint.methodName}(

    ${methodParams}

  ) {

${endpointLogic}

${requestStatement}

  }

`;

      serviceContent =

        serviceContent.replace(

          /\}\s*$/,

          `${methodTemplate}

}`

        );

      console.log(
        `Generated Service Method:
${endpoint.methodName}`
      );

    }

  );

  // ==========================================
  // WRITE FILE
  // ==========================================

  fs.writeFileSync(

    servicePath,

    serviceContent

  );

}

// ============================================
// GENERATE TESTS
// ============================================

function generateTests(module) {

  const testDir = path.join(

    process.cwd(),

    module.testPath

  );

  // ==========================================
  // CREATE DIRECTORY
  // ==========================================

  if (

    !fs.existsSync(testDir)

  ) {

    fs.mkdirSync(

      testDir,

      { recursive: true }

    );

  }

  // ==========================================
  // PROCESS ENDPOINTS
  // ==========================================

  module.endpoints.forEach(

    (endpoint) => {

      const testFilePath = path.join(

        testDir,

        `${endpoint.methodName}.spec.js`

      );

      if (

        fs.existsSync(testFilePath)

      ) {

        return;

      }

      // ======================================
      // DYNAMIC VARIABLE IMPORTS
      // ======================================

      let utilityImports = '';

      if (

        endpoint.dynamicRuntimeVariables
          .includes('deviceId')

      ) {

        utilityImports =

`
import {
  generateDeviceId
}
from '../../utils/commonUtility.js';
`;

      }

      // ======================================
      // BASE IMPORTS
      // ======================================

      let testContent =

`import { test } from '@playwright/test';

import { ${module.serviceName} } from '../../services/${module.serviceName}.js';

import { validateCommonAssertions } from '../../utils/commonAssertions.js';
${utilityImports}
`;

      // ======================================
      // TEST START
      // ======================================

      testContent +=

`
test(

  '${endpoint.endpointName}',

  async ({ request }) => {

    const service =
      new ${module.serviceName}();

`;

      // ======================================
      // DYNAMIC VARIABLES
      // ======================================

      if (

        endpoint.dynamicRuntimeVariables
          .includes('deviceId')

      ) {

        testContent +=

`
    const deviceId =
      generateDeviceId();

`;

      }

      // ======================================
      // METHOD CALL ARGUMENTS
      // ======================================

      const methodCallArguments = [

        'request'

      ];

      // ======================================
      // PATH VARIABLES
      // ======================================

      endpoint.pathVariables.forEach(

        (variable) => {

          methodCallArguments.push(

            `process.env.${convertToEnvVariable(variable)}`

          );

        }

      );

      // ======================================
      // QUERY VARIABLES
      // ======================================

      endpoint.queryVariables.forEach(

        (variable) => {

          const variableType =

            endpoint
              .runtimeVariableClassification[
                variable
              ];

          // ==================================
          // DYNAMIC GENERATED
          // ==================================

          if (

            variableType ===
            'dynamicGenerated'

          ) {

            methodCallArguments.push(
              variable
            );

          }

          // ==================================
          // ENV VARIABLES
          // ==================================

          else {

            methodCallArguments.push(

              `process.env.${convertToEnvVariable(variable)}`

            );

          }

        }

      );

      // ======================================
      // PAYLOAD
      // ======================================

      if (

        endpoint.requiresPayload

      ) {

        const payloadBuilder =

          `build${endpoint.methodName
            .charAt(0)
            .toUpperCase()}${endpoint.methodName
            .slice(1)}Payload`;

        testContent +=

`
    const payload =
      ${payloadBuilder}();

`;

        methodCallArguments.push(
          'payload'
        );

      }

      // ======================================
      // METHOD EXECUTION
      // ======================================

      testContent +=

`
    const {

      response,

      bodyText,

      time

    } = await service.${endpoint.methodName}(

      ${methodCallArguments.join(',\n      ')}

    );

`;

      // ======================================
      // RESPONSE PARSE
      // ======================================

      testContent +=

`
    const body =
      JSON.parse(bodyText);

`;

      // ======================================
      // ASSERTIONS
      // ======================================

      testContent +=

`
    validateCommonAssertions({

      response,

      body,

      time,

      expectedStatus:
        ${endpoint.statusAssertions[0]}

    });

`;

      // ======================================
      // COMMENTS
      // ======================================

      endpoint.testAssertions.forEach(

        (assertion) => {

          testContent +=

`
    // ${assertion}

`;

        }

      );

      // ======================================
      // TEST END
      // ======================================

      testContent +=

`
  }

);
`;

      fs.writeFileSync(

        testFilePath,

        testContent

      );

      console.log(
        `Generated Test:
${endpoint.methodName}.spec.js`
      );

    }

  );

}

// ============================================
// GENERATE PAYLOADS
// ============================================

function generatePayloads(module) {

  if (

    !module.payloads ||

    module.payloads.length === 0

  ) {

    return;

  }

  const payloadDir = path.join(

    process.cwd(),

    module.payloadPath

  );

  if (

    !fs.existsSync(payloadDir)

  ) {

    fs.mkdirSync(

      payloadDir,

      { recursive: true }

    );

  }

  module.payloads.forEach(

    (payloadData) => {

      const payloadFilePath = path.join(

        payloadDir,

        `${payloadData.payloadBuilder}.js`

      );

      if (

        fs.existsSync(payloadFilePath)

      ) {

        return;

      }

      const payloadContent =

`
export function ${payloadData.payloadBuilder}() {

  return ${JSON.stringify(

    payloadData.originalPayload,

    null,

    2

  )};

}
`;

      fs.writeFileSync(

        payloadFilePath,

        payloadContent

      );

      console.log(
        `Generated Payload:
${payloadData.payloadBuilder}.js`
      );

    }

  );

}

// ============================================
// ENV VARIABLE FORMAT
// ============================================

function convertToEnvVariable(variable) {

  return variable

    .replace(/([A-Z])/g, '_$1')

    .replace(/-/g, '_')

    .toUpperCase();

}

// ============================================
// SUCCESS LOGS
// ============================================

console.log(
  '================================'
);

console.log(
  'CODE GENERATION COMPLETED'
);

console.log(
  '================================'
);

console.log(
  `Modules:
${frameworkMap.modules.length}`
);

