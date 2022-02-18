import { InferJSONSchema } from "../src/json-schema-type-inferrer";
// Annotations
type Annotations = InferJSONSchema<{
  type: "string";
  title: "Match anything";
  description: "This is a schema that matches anything.";
  default: "Default value";
  examples: ["Anything", 4035];
  readOnly: true;
  writeOnly: false;
  deprecated: true;
}>;
const annotation: Annotations = "string";

const allowAll: InferJSONSchema<{}> = "ok";
const allowAll2: InferJSONSchema<true> = "ok";

// @ts-expect-error
const denyAll: InferJSONSchema<false> = "false";

const nullSchema: InferJSONSchema<{ type: "null" }> = null;

// @ts-expect-error
const nullSchema2: InferJSONSchema<{ type: "null" }> = "null";
