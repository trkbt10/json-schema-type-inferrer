import type { InferJSONSchemaDraft04 } from "../../src/json-schema-draft-04";
import { schema } from "./json-schema-draft-04";

describe("JSONSchemaDraft04", () => {
  type JSONSchemaDraft04Schema = InferJSONSchemaDraft04<typeof schema>;
  it("should be match jsonschem draft 04", () => {
    const valid: JSONSchemaDraft04Schema = {
      id: "http://json-schema.org/draft-04/schema#",
      $schema: "http://json-schema.org/draft-04/schema#",
      description: "Core schema meta-schema",
      multipleOf: 0,
      maximum: 0,
      exclusiveMaximum: false,
      exclusiveMinimum: false,
      maxLength: 1,
      minLength: 1,
      pattern: "regex",
      title: "",
      default: undefined,
      minimum: 0,
      additionalItems: false,
      items: undefined,
      maxItems: 0,
      minItems: undefined,
      uniqueItems: false,
      maxProperties: 0,
      minProperties: undefined,
      required: [],
      additionalProperties: undefined,
      definitions: undefined,
      properties: undefined,
      patternProperties: undefined,
      dependencies: undefined,
      enum: undefined,
      type: undefined,
      format: "",
      allOf: [],
      anyOf: [],
      oneOf: [],
      not: undefined,
    };
  });
  it("schemaArray", () => {
    const schemaArray: InferJSONSchemaDraft04<
      typeof schema.definitions["schemaArray"]
    > = [];
  });
  it("positiveInteger", () => {
    const positiveInteger: InferJSONSchemaDraft04<
      typeof schema.definitions["positiveInteger"]
    > = 1;
  });
  it("positiveIntegerDefault0", () => {
    const positiveIntegerDefault0: InferJSONSchemaDraft04<
      typeof schema.definitions["positiveIntegerDefault0"]
    > = 0;
  });
  it("stringArray", () => {
    const stringArray: InferJSONSchemaDraft04<
      typeof schema.definitions["stringArray"]
    > = ["string", "number"];
  });
});
