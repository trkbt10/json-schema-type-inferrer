import { InferJSONSchemaDraft06 } from "../../src/json-schema-draft-06";
import { schema } from "./json-schema-draft-06";
it("JSONSchema Draft-06", () => {
  type Schema = InferJSONSchemaDraft06<typeof schema>;
  const type: Schema = {
    $id: "http://example.com/example.json",
    $schema: "http://json-schema.org/draft/2020-12/schema",
    title: "Example Schema",
    description: "Example description",
    required: ["firstName", "lastName"],
    type: "object",
    examples: [],
    multipleOf: 0,
    maximum: 0,
    exclusiveMaximum: false,
  };
});
