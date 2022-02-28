import {
  InferJSONSchemaDraft04,
  InferForValidationSchema,
  ConcatTypes,
  InferNullable,
} from "../../src/json-schema-draft-04";
describe("allOf", () => {
  it("array", () => {
    const allOf = {
      allOf: [
        {
          type: "string",
        },
        {
          nullable: true,
        },
      ],
    } as const;
    type AllOfSchema = InferForValidationSchema<typeof allOf, {}>;
    type Concated = ConcatTypes<typeof allOf["allOf"]>;
    type NullableType = InferNullable<
      {
        readonly nullable: true;
      },
      "never"
    >;
    const schema = {
      type: "array",
      items: {
        allOf: [
          {
            type: "string",
          },
          {
            nullable: true,
          },
        ],
      },
    } as const;
    const type: InferJSONSchemaDraft04<typeof schema> = ["1", null];
  });
});
