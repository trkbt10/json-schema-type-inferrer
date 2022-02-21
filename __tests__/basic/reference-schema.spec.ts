import { InferJSONSchema } from "../../src/json-schema-type-inferrer";
import { Mutable } from "../../src/utilities";

describe("ReferenceSchema", () => {
  const schema = {
    definitions: {
      text: {
        type: "string",
      },
    },
    type: "array",
    items: {
      $ref: "#/definitions/text",
    },
  } as const;
  type Schema = Mutable<typeof schema>;
  type TextSchema = InferJSONSchema<Schema>;
  it("string type", () => {
    const type: TextSchema = ["string"];
  });
});
