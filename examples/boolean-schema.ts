import { InferJSONSchema } from "../src/json-schema-type-inferrer";

const booleanSchema = {
  type: "boolean",
} as const;
const boolean: InferJSONSchema<typeof booleanSchema> = true; // boolean
