/**
 * ============================================
 * FRAMEWORK SUMMARY
 * ============================================
 *
 * PURPOSE:
 * Convert deep framework analysis into
 * clean generator intelligence.
 *
 * INPUT:
 * Agent/output/frameworkAnalysis.json
 *
 * OUTPUT:
 * Agent/output/frameworkSummary.json
 *
 * ============================================
 */

import fs from 'fs';

import path from 'path';

// ============================================
// INPUT FILE
// ============================================

const analysisPath = path.join(

  process.cwd(),

  'Agent',

  'output',

  'frameworkAnalysis.json'

);

// ============================================
// VALIDATE INPUT
// ============================================

if (

  !fs.existsSync(analysisPath)

) {

  throw new Error(
    'frameworkAnalysis.json not found'
  );

}

// ============================================
// READ ANALYSIS
// ============================================

const frameworkAnalysis =
  JSON.parse(

    fs.readFileSync(

      analysisPath,

      'utf-8'

    )

  );

// ============================================
// SERVICE ANALYSIS
// ============================================

const servicePatterns =
  frameworkAnalysis.services;

// ============================================
// TEST ANALYSIS
// ============================================

const testPatterns =
  frameworkAnalysis.tests;

// ============================================
// CODING CONVENTIONS
// ============================================

const codingConventions =
  frameworkAnalysis.codingConventions;

// ============================================
// DETECT FRAMEWORK STYLE
// ============================================

const frameworkStyle = {

  usesMinimalMethods:
    codingConventions
      .prefersMinimalMethods,

  usesExplicitArguments:
    codingConventions
      .prefersExplicitArguments,

  usesSimpleApiRequest:
    codingConventions
      .prefersSimpleApiRequest,

  usesDirectEndpointReplacement:
    codingConventions
      .prefersDirectEndpointReplacement,

  usesPayloadOnlyWhenRequired:
    codingConventions
      .prefersPayloadOnlyWhenRequired

};

// ============================================
// DETECT SERVICE SIGNATURE STYLE
// ============================================

let serviceSignatureStyle =
  'simple';

if (

  frameworkStyle
    .usesExplicitArguments

) {

  serviceSignatureStyle =
    'explicitArguments';

}

// ============================================
// DETECT API REQUEST STYLE
// ============================================

let apiRequestStyle =
  'simple';

if (

  !frameworkStyle
    .usesSimpleApiRequest

) {

  apiRequestStyle =
    'complex';

}

// ============================================
// DETECT ENDPOINT STYLE
// ============================================

let endpointStyle =
  'direct';

if (

  frameworkStyle
    .usesDirectEndpointReplacement

) {

  endpointStyle =
    'replaceVariables';

}

// ============================================
// DETECT PAYLOAD STRATEGY
// ============================================

let payloadStrategy =
  'onlyWhenRequired';

if (

  !frameworkStyle
    .usesPayloadOnlyWhenRequired

) {

  payloadStrategy =
    'always';

}

// ============================================
// SUMMARY OBJECT
// ============================================

const frameworkSummary = {

  frameworkIdentity:
    frameworkAnalysis
      .frameworkIdentity,

  folderStructure:
    frameworkAnalysis
      .folderStructure,

  subFolders:
    frameworkAnalysis
      .subFolders,

  endpointPatterns:
    frameworkAnalysis
      .endpointPatterns,

  assertionPatterns:
    frameworkAnalysis
      .assertionPatterns,

  importPatterns:
    frameworkAnalysis
      .importPatterns,

  architectureRules:
    frameworkAnalysis
      .architectureRules,

  frameworkStyle,

  generationStrategy: {

    serviceSignatureStyle,

    apiRequestStyle,

    endpointStyle,

    payloadStrategy

  },

  servicePatterns: {

    totalServices:
      servicePatterns.length,

    services:
      servicePatterns.map(

        (service) => ({

          fileName:
            service.fileName,

          methods:
            service.methods,

          usesPayload:
            service.usesPayload,

          usesEndpointReplace:
            service.usesEndpointReplace,

          usesSimpleRequest:
            service.usesSimpleRequest

        })

      )

  },

  testPatterns: {

    totalTests:
      testPatterns.length,

    usesPlaywright:
      testPatterns.every(
        test =>
          test.usesPlaywright
      ),

    usesCommonAssertions:
      testPatterns.every(
        test =>
          test.usesCommonAssertions
      ),

    parsesJson:
      testPatterns.some(
        test =>
          test.parsesJson
      )

  }

};

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

  'frameworkSummary.json'

);

fs.writeFileSync(

  outputFile,

  JSON.stringify(

    frameworkSummary,

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
  'FRAMEWORK SUMMARY COMPLETED'
);

console.log(
  '================================'
);

console.log(
  `Services:
${frameworkSummary.servicePatterns.totalServices}`
);

console.log(
  `Tests:
${frameworkSummary.testPatterns.totalTests}`
);

console.log(
  `Output:
${outputFile}`
);

