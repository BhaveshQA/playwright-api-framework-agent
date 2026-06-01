import { execSync }
  from 'child_process';

// ============================================
// PIPELINE START TIME
// ============================================

const pipelineStart =
  Date.now();

// ============================================
// RUN STEP UTILITY
// ============================================

function runStep(

  stepName,

  command

) {

  console.log('\n');

  console.log(
    '================================'
  );

  console.log(
    `STARTING:
${stepName}`
  );

  console.log(
    '================================'
  );

  const stepStart =
    Date.now();

  try {

    execSync(

      command,

      {

        stdio: 'inherit'

      }

    );

    const duration =

      (
        Date.now() -
        stepStart
      ) / 1000;

    console.log('\n');

    console.log(
      `COMPLETED:
${stepName}`
    );

    console.log(
      `Duration:
${duration.toFixed(2)} sec`
    );

  }

  catch (error) {

    console.error('\n');

    console.error(
      '================================'
    );

    console.error(
      `FAILED:
${stepName}`
    );

    console.error(
      '================================'
    );

    console.error(
      error.message
    );

    process.exit(1);

  }

}

// ============================================
// PIPELINE EXECUTION
// ============================================

runStep(

  'Framework Analyzer',

  'node Agent/analyzer/frameworkAnalyzer.js'

);

runStep(

  'Framework Summary',

  'node Agent/analyzer/frameworkSummary.js'

);

runStep(

  'Postman Parser',

  'node Agent/parser/postmanParser.js'

);

runStep(

  'Framework Mapper',

  'node Agent/generator/frameworkMapper.js'

);

runStep(

  'Code Generator',

  'node Agent/generator/codeGenerator.js'

);

// ============================================
// FINAL SUMMARY
// ============================================

const totalDuration =

  (
    Date.now() -
    pipelineStart
  ) / 1000;

console.log('\n');

console.log(
  '================================'
);

console.log(
  'FULL AGENT PIPELINE COMPLETED'
);

console.log(
  '================================'
);

console.log(
  `Total Duration:
${totalDuration.toFixed(2)} sec`
);

console.log('\n');

console.log(
  'Generated Output:'
);

console.log(
  '- Agent/output/frameworkAnalysis.json'
);

console.log(
  '- Agent/output/frameworkSummary.json'
);

console.log(
  '- Agent/output/postmanCollection.json'
);

console.log(
  '- Agent/output/frameworkMap.json'
);

console.log(
  '- services/ (extended)'
);

console.log(
  '- tests/ (extended)'
);

console.log(
  '- payloads/ (extended if required)'
);

console.log(
  '- config/apiEndpoints.js (updated)'
);

console.log('\n');

console.log(
  'Framework-aware code generation completed successfully'
);

