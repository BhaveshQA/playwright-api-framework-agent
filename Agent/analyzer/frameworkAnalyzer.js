/**
 * ============================================
 * FRAMEWORK ANALYZER
 * ============================================
 *
 * PURPOSE:
 * Deeply study existing framework
 * and extract REAL coding conventions.
 *
 * OUTPUT:
 * Agent/output/frameworkAnalysis.json
 *
 * ============================================
 */

import fs from 'fs';

import path from 'path';

// ============================================
// ROOT PATH
// ============================================

const ROOT_DIR = process.cwd();

// ============================================
// IMPORTANT FOLDERS
// ============================================

const IMPORTANT_FOLDERS = [

  'services',
  'tests',
  'payloads',
  'utils',
  'schemas',
  'config'

];

// ============================================
// ANALYSIS OBJECT
// ============================================

const frameworkAnalysis = {

  frameworkIdentity: {

    frameworkType:
      'Playwright API Automation Framework',

    architectureStyle:
      'Layered Architecture',

    sourceOfTruth:
      'Existing framework implementation'

  },

  folderStructure: {},

  folderResponsibilities: {},

  subFolders: {},

  services: [],

  tests: [],

  payloads: [],

  utilities: [],

  endpointPatterns: {},

  assertionPatterns: {},

  servicePatterns: {},

  runtimePatterns: {},

  codingConventions: {},

  importPatterns: {},

  architectureRules: {}

};

// ============================================
// UTILITY
// ============================================

function readDirectory(folderPath) {

  if (!fs.existsSync(folderPath)) {

    return [];

  }

  return fs.readdirSync(folderPath);

}

// ============================================
// ANALYZE FOLDERS
// ============================================

IMPORTANT_FOLDERS.forEach(

  (folderName) => {

    const folderPath = path.join(

      ROOT_DIR,

      folderName

    );

    frameworkAnalysis.folderStructure[
      folderName
    ] = `${folderName}/`;

    frameworkAnalysis.subFolders[
      folderName
    ] = [];

    if (

      !fs.existsSync(folderPath)

    ) {

      return;

    }

    const folderItems =
      fs.readdirSync(folderPath);

    folderItems.forEach(

      (item) => {

        const fullPath = path.join(

          folderPath,

          item

        );

        if (

          fs.statSync(fullPath).isDirectory()

        ) {

          frameworkAnalysis.subFolders[
            folderName
          ].push(item);

        }

      }

    );

  }

);

// ============================================
// ANALYZE SERVICES
// ============================================

const servicesPath = path.join(

  ROOT_DIR,

  'services'

);

if (

  fs.existsSync(servicesPath)

) {

  const serviceFiles =

    fs.readdirSync(servicesPath)

      .filter(

        (file) =>

          file.endsWith('Service.js')

      );

  serviceFiles.forEach(

    (file) => {

      const filePath = path.join(

        servicesPath,

        file

      );

      const content =

        fs.readFileSync(

          filePath,

          'utf-8'

        );

      // ======================================
      // METHOD SIGNATURES
      // ======================================

      const methodMatches =

        [...content.matchAll(

          /async\s+(\w+)\s*\((.*?)\)/gs

        )];

      const methods = [];

      methodMatches.forEach(

        (match) => {

          methods.push({

            methodName:
              match[1],

            parameters:
              match[2]

                .split(',')

                .map(param =>
                  param.trim()
                )

                .filter(Boolean)

          });

        }

      );

      // ======================================
      // DETECT PATTERNS
      // ======================================

      const usesApiClient =
        content.includes(
          'apiRequest('
        );

      const usesPayload =
        content.includes(
          'payload'
        );

      const usesRuntimeData =
        content.includes(
          'runtimeData'
        );

      const usesEndpointReplace =
        content.includes(
          '.replace('
        );

      const usesFetchOptions =
        content.includes(
          'fetchOptions'
        );

    const usesSimpleRequest =
  /apiRequest\s*\(\s*request\s*,/g
    .test(content);

      frameworkAnalysis.services.push({

        fileName: file,

        methods,

        usesApiClient,

        usesPayload,

        usesRuntimeData,

        usesEndpointReplace,

        usesFetchOptions,

        usesSimpleRequest

      });

    }

  );

}

// ============================================
// ANALYZE TESTS
// ============================================

const testsPath = path.join(

  ROOT_DIR,

  'tests'

);

function analyzeTestFiles(folderPath) {

  const items =
    fs.readdirSync(folderPath);

  items.forEach(

    (item) => {

      const fullPath = path.join(

        folderPath,

        item

      );

      if (

        fs.statSync(fullPath).isDirectory()

      ) {

        analyzeTestFiles(fullPath);

      }

      else if (

        item.endsWith('.spec.js')

      ) {

        const content =

          fs.readFileSync(

            fullPath,

            'utf-8'

          );

        frameworkAnalysis.tests.push({

          fileName: item,

          usesPlaywright:
            content.includes(
              '@playwright/test'
            ),

          usesCommonAssertions:
            content.includes(
              'validateCommonAssertions'
            ),

          usesRuntimeData:
            content.includes(
              'runtimeData'
            ),

          usesPayload:
            content.includes(
              'payload'
            ),

          parsesJson:
            content.includes(
              'JSON.parse'
            )

        });

      }

    }

  );

}

if (

  fs.existsSync(testsPath)

) {

  analyzeTestFiles(testsPath);

}

// ============================================
// ANALYZE API ENDPOINTS
// ============================================

const endpointFile = path.join(

  ROOT_DIR,

  'config',

  'apiEndpoints.js'

);

if (

  fs.existsSync(endpointFile)

) {

  const endpointContent =

    fs.readFileSync(

      endpointFile,

      'utf-8'

    );

  frameworkAnalysis.endpointPatterns = {

    centralized:
      endpointContent.includes(
        'API_ENDPOINTS'
      ),

    usesTemplateVariables:
      endpointContent.includes(
        '${'
      ),

    exportStyle:
      endpointContent.includes(
        'export const API_ENDPOINTS'
      )

  };

}

// ============================================
// ANALYZE ASSERTION STYLE
// ============================================

const assertionFile = path.join(

  ROOT_DIR,

  'utils',

  'commonAssertions.js'

);

if (

  fs.existsSync(assertionFile)

) {

  const assertionContent =

    fs.readFileSync(

      assertionFile,

      'utf-8'

    );

  frameworkAnalysis.assertionPatterns = {

    centralizedAssertions:
      assertionContent.includes(
        'validateCommonAssertions'
      ),

    validatesStatus:
      assertionContent.includes(
        'validateStatusCode'
      ),

    validatesResponseTime:
      assertionContent.includes(
        'validateResponseTime'
      )

  };

}

// ============================================
// DETECT CODING CONVENTIONS
// ============================================

const allServiceMethods =

  frameworkAnalysis.services.flatMap(
    service => service.methods
  );

const minimalParameterStyle =

  allServiceMethods.every(

    method =>

      method.parameters.length <= 2

  );

frameworkAnalysis.codingConventions = {

  prefersMinimalMethods:
    minimalParameterStyle,

  prefersSimpleApiRequest:
    frameworkAnalysis.services.every(
      service =>
        service.usesSimpleRequest
    ),

  prefersExplicitArguments:
    frameworkAnalysis.services.every(
      service =>
        !service.usesRuntimeData
    ),

  prefersDirectEndpointReplacement:
    frameworkAnalysis.services.some(
      service =>
        service.usesEndpointReplace
    ),

  prefersPayloadOnlyWhenRequired:
    frameworkAnalysis.services.some(
      service =>
        service.usesPayload
    )

};

// ============================================
// IMPORT PATTERNS
// ============================================

frameworkAnalysis.importPatterns = {

  serviceImportStyle:
    '../services/',

  utilityImportStyle:
    '../utils/',

  payloadImportStyle:
    '../payloads/'

};

// ============================================
// ARCHITECTURE RULES
// ============================================

frameworkAnalysis.architectureRules = {

  generatorMustStudyRealCode:
    true,

  generatorMustFollowExistingStyle:
    true,

  generatorMustNotInventArchitecture:
    true,

  generatorMustReuseUtilities:
    true,

  generatorMustMirrorMethodSignatures:
    true,

  generatorMustGenerateMinimalCode:
    true,

  generatorMustOnlyUsePayloadsWhenRequired:
    true,

  generatorMustAvoidGenericRuntimeAbstractions:
    true

};

// ============================================
// OUTPUT DIRECTORY
// ============================================

const outputDir = path.join(

  ROOT_DIR,

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

  'frameworkAnalysis.json'

);

fs.writeFileSync(

  outputFile,

  JSON.stringify(

    frameworkAnalysis,

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
  'FRAMEWORK ANALYSIS COMPLETED'
);

console.log(
  '================================'
);

console.log(
  `Services:
${frameworkAnalysis.services.length}`
);

console.log(
  `Tests:
${frameworkAnalysis.tests.length}`
);

console.log(
  `Output:
${outputFile}`
);

