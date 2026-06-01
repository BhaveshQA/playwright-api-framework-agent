/**
 * ============================================
 * SCRIPT INTELLIGENCE ANALYZER
 * ============================================
 *
 * PURPOSE:
 * Analyze Postman pre-request and test scripts
 * to detect runtime workflow intelligence.
 *
 * RESPONSIBILITIES:
 * - variable extraction detection
 * - runtime dependency detection
 * - assertion intelligence
 * - query/header/body variable detection
 * - response extraction detection
 * - token management detection
 * - payload mutation detection
 * - workflow chaining intelligence
 *
 * ============================================
 */

export function analyzeScripts({

  preRequestScript = '',

  testScript = '',

  requestUrl = '',

  headers = [],

  body = '',

  runtimeVariableClassification = {}

}) {

  // ============================================
  // COMBINED SCRIPT
  // ============================================

  const combinedScript =

    `
      ${preRequestScript}

      ${testScript}
    `;

  // ============================================
  // VARIABLE SET DETECTION
  // ============================================

  const variableSetRegex =

    /pm\.(environment|collectionVariables|globals)\.set\(\s*"([^"]+)"/g;

  const variablesSet = [];

  let match;

  while (

    (match = variableSetRegex.exec(combinedScript))

    !== null

  ) {

    variablesSet.push({

      variable:
        match[2],

      scope:
        match[1]

    });

  }

  // ============================================
  // STATUS ASSERTIONS
  // ============================================

  const statusRegex =

    /pm\.response\.to\.have\.status\((\d+)\)/g;

  const statusAssertions = [];

  while (

    (match = statusRegex.exec(combinedScript))

    !== null

  ) {

    statusAssertions.push(

      Number(match[1])

    );

  }

  // ============================================
  // PM.TEST ASSERTIONS
  // ============================================

  const pmTestRegex =

    /pm\.test\(\s*"([^"]+)"/g;

  const testAssertions = [];

  while (

    (match = pmTestRegex.exec(combinedScript))

    !== null

  ) {

    testAssertions.push(

      match[1]

    );

  }

  // ============================================
  // SCHEMA VALIDATION
  // ============================================

  const hasSchemaValidation =

    combinedScript.includes(
      'jsonSchema'
    ) ||

    combinedScript.includes(
      'tv4'
    );

  // ============================================
  // VARIABLE USAGE DETECTION
  // ============================================

  const variableUsageRegex =
    /{{(.*?)}}/g;

  // ============================================
  // PATH VARIABLES
  // ============================================

  const pathVariables = [];

  const queryVariables = [];

  const [pathPart, queryPart] =

    requestUrl.split('?');

  while (

    (match = variableUsageRegex.exec(pathPart))

    !== null

  ) {

    if (

      match[1] !== 'apiUrl'

    ) {

      pathVariables.push(

        match[1]

      );

    }

  }

  // ============================================
  // QUERY VARIABLES
  // ============================================

  if (queryPart) {

    while (

      (match = variableUsageRegex.exec(queryPart))

      !== null

    ) {

      queryVariables.push(

        match[1]

      );

    }

  }

  // ============================================
  // HEADER VARIABLES
  // ============================================

  const headerVariables = [];

  for (const header of headers) {

    const value =
      header.value || '';

    while (

      (match = variableUsageRegex.exec(value))

      !== null

    ) {

      headerVariables.push(

        match[1]

      );

    }

  }

  // ============================================
  // BODY VARIABLES
  // ============================================

  const bodyVariables = [];

  while (

    (match = variableUsageRegex.exec(body))

    !== null

  ) {

    bodyVariables.push(

      match[1]

    );

  }

  // ============================================
  // VARIABLES USED
  // ============================================

  const variablesUsed = [

    ...pathVariables,

    ...queryVariables,

    ...headerVariables,

    ...bodyVariables

  ];

  // ============================================
  // RESPONSE EXTRACTION DETECTION
  // ============================================

  const responseExtractionRegex =

    /pm\.(environment|collectionVariables|globals)\.set\(\s*"([^"]+)"/g;

  const responseVariablesExtracted = [];

  while (

    (match = responseExtractionRegex.exec(testScript))

    !== null

  ) {

    responseVariablesExtracted.push({

      variable:
        match[2],

      scope:
        match[1]

    });

  }

  // ============================================
  // RESPONSE BODY ACCESS DETECTION
  // ============================================

  const responseAccessRegex =

    /responseBody\.(\w+)|response\.(\w+)/g;

  const responseFieldsUsed = [];

  while (

    (match = responseAccessRegex.exec(combinedScript))

    !== null

  ) {

    responseFieldsUsed.push(

      match[1] || match[2]

    );

  }

  // ============================================
  // TOKEN MANAGEMENT DETECTION
  // ============================================

  const tokenManagementRegex =

    /(token|Authorization|Bearer)/i;

  const tokenManagement =

    tokenManagementRegex.test(
      combinedScript
    );

  // ============================================
  // PAYLOAD MUTATION DETECTION
  // ============================================

  const payloadMutation =

    combinedScript.includes(
      'request.body'
    ) ||

    combinedScript.includes(
      'pm.request.body'
    );

  // ============================================
  // RUNTIME DEPENDENCY DETECTION
  // ============================================

  const runtimeDependencies = [];

  variablesUsed.forEach((variable) => {

    const lowerVariable =
      variable.toLowerCase();

    // ============================================
    // SESSION DEPENDENCY
    // ============================================

    if (

      lowerVariable.includes(
        'session'
      )

    ) {

      runtimeDependencies.push({

        variable,

        dependencyType:
          'sessionDependency'

      });

    }

    // ============================================
    // SPONSOR DEPENDENCY
    // ============================================

    if (

      lowerVariable.includes(
        'sponsor'
      )

    ) {

      runtimeDependencies.push({

        variable,

        dependencyType:
          'sponsorDependency'

      });

    }

    // ============================================
    // QUESTION DEPENDENCY
    // ============================================

    if (

      lowerVariable.includes(
        'question'
      )

    ) {

      runtimeDependencies.push({

        variable,

        dependencyType:
          'questionDependency'

      });

    }

    // ============================================
    // USER DEPENDENCY
    // ============================================

    if (

      lowerVariable.includes(
        'user'
      )

    ) {

      runtimeDependencies.push({

        variable,

        dependencyType:
          'userDependency'

      });

    }

  });

  // ============================================
  // REMOVE DUPLICATE DEPENDENCIES
  // ============================================

  const uniqueRuntimeDependencies =

    runtimeDependencies.filter(

      (dependency, index, self) =>

        index === self.findIndex(

          (item) =>

            item.variable ===
            dependency.variable

        )

    );

  // ============================================
  // DYNAMIC RUNTIME VARIABLES
  // ============================================

  const dynamicRuntimeVariables =

    Object.entries(
      runtimeVariableClassification
    )

    .filter(

      ([, type]) =>

        type === 'dynamicGenerated'

    )

    .map(

      ([variable]) => variable

    );

  // ============================================
  // RETURN FINAL INTELLIGENCE
  // ============================================

  return {

    variablesSet,

    variablesUsed,

    runtimeVariableClassification,

    dynamicRuntimeVariables,

    statusAssertions,

    testAssertions,

    hasSchemaValidation,

    pathVariables,

    queryVariables,

    headerVariables,

    bodyVariables,

    responseVariablesExtracted,

    responseFieldsUsed,

    tokenManagement,

    payloadMutation,

    runtimeDependencies:
      uniqueRuntimeDependencies

  };

}

