import { InferMultipleTypeSchema } from "../../src/json-schema-draft-04";
import { InferJSONSchema } from "../../src/json-schema-type-inferrer";

describe("Basic", () => {
  it("Numeric", () => {
    const data: InferJSONSchema<{
      type: "number";
    }> = 0;
  });
  it("String", () => {
    const data: InferJSONSchema<{
      type: "string";
    }> = "string";
  });
  it("Array", () => {
    const data: InferJSONSchema<{
      type: "array";
      items: {
        type: "string";
      };
    }> = ["a", "b"];
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
    const str: InferMultipleTypeSchema<{
      type: ["string", "number"];
    }> = "string";
    const num: InferMultipleTypeSchema<{
      type: ["string", "number"];
    }> = 0;
  });
});
