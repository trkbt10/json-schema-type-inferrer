import { InferJSONSchemaDraft06 } from "../../src/json-schema-draft-06";
import { schema } from "./json-schema-draft-06";
it("JSONSchema Draft-06", () => {
  type Schema = InferJSONSchemaDraft06<typeof schema>;
});
