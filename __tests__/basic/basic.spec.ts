import { InferMultipleTypeSchema } from "../../src/json-schema-draft-04";
import { InferJSONSchema } from "../../src/json-schema-type-inferrer";

describe("Basic", () => {
  it("Numeric", () => {
    const schema = {
      type: "number",
    } as const;
    const data: InferJSONSchema<typeof schema> = 0;
  });
  it("String", () => {
    const schema = {
      type: "string",
    } as const;
    const data: InferJSONSchema<typeof schema> = "string";
  });
  it("Array", () => {
    const schema = {
      type: "array",
      items: {
        type: "string",
      },
    } as const;
    const data: InferJSONSchema<typeof schema> = ["a", "b"];
  });
  it("Object JSONSchema", () => {
    const data: InferJSONSchema<{
      type: "object";
      properties: {
        a: {
          type: "string";
        };
      };
    }> = { a: "string" };
  });
  it("Multiple type JSONSchema", () => {
    const schema = {
      type: ["string", "number"],
    } as const;
    const str: InferMultipleTypeSchema<typeof schema> = "string";
    const schema2 = {
      type: ["string", "number"],
    } as const;
    const num: InferMultipleTypeSchema<typeof schema2> = 0;
  });
});
