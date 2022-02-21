import { InferJSONSchemaDraft04 } from "../../src/json-schema-draft-04";
describe("allOf", () => {
  it("array", () => {
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
