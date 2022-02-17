import { InferJSONSchema } from "../src/json-schema-type-inferrer";

const stringSchema = {
  type: "string",
} as const;
const string: InferJSONSchema<typeof stringSchema> = "string";
