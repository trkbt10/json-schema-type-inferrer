import { InferJSONSchemaDraft04 } from "../../src/json-schema-draft-04";
import { Mutable } from "../../src/utilities";
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
    const type: InferJSONSchemaDraft04<Mutable<typeof schema>> = ["1", null];
  });
});
