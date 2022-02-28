import {
  InferJSONSchemaDraft04,
  InferAdditionalPropertiesSchema,
  InferJSONSchemaType,
  InferForValidationSchema,
  MapForAnyOfProperties,
} from "../../src/json-schema-draft-04";

describe("anyOf", () => {
  it("object", () => {
    const schema = {
      type: "object",
      additionalProperties: {
        anyOf: [
          {
            type: "boolean",
          },
          {
            type: "string",
          },
        ],
      },
    } as const;
    type Schema = InferJSONSchemaDraft04<typeof schema>;
    type AnyOf = MapForAnyOfProperties<
      typeof schema["additionalProperties"]["anyOf"],
      typeof schema
    >;
    type AnyOf2 = InferForValidationSchema<
      typeof schema["additionalProperties"],
      {}
    >;
    type AdditionalProperties = InferAdditionalPropertiesSchema<
      typeof schema,
      {}
    >;
    const type: Schema[] = [
      {
        item: true,
        item2: "string",
      },
      {
        item: true,
        // @ts-expect-error
        item2: 1234,
      },
      {
        // @ts-expect-error
        item2: 1234,
      },
    ];
  });
  it("array", () => {
    const schema = {
      type: "array",
      items: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "boolean",
          },
        ],
      },
    } as const;
    const type: InferJSONSchemaDraft04<typeof schema> = ["1", true];
  });
});
