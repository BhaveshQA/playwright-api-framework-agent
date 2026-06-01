import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

export async function validateSchema(schema, data) {
  const validate = ajv.compile(schema);

  const valid = validate(data);

  if (!valid) {
    console.log("Schema validation failed:\n");

    validate.errors.forEach((err, index) => {
      console.log(`Error ${index + 1}:`);
      console.log(`Path   : ${err.instancePath || "root"}`);
      console.log(`Message: ${err.message}`);
      console.log("---------------------------");
    });

    const summary = validate.errors
      .slice(0, 5)
      .map((e) => `${e.instancePath || "/"} ${e.message}`)
      .join("; ");
    throw new Error(`Schema validation failed: ${summary}`);
  }

  console.log("Schema validation passed");
}