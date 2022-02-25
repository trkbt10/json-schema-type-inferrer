import { InferJSONSchemaDraft04 } from "../../src/json-schema-draft-04";
import { Mutable } from "../../src/utilities";

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
    type Schema = InferJSONSchemaDraft04<Mutable<typeof schema>>;
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
    const type: InferJSONSchemaDraft04<Mutable<typeof schema>> = ["1", true];
  });
});
