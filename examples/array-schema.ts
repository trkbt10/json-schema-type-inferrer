import type { InferJSONSchema } from "../src/json-schema-type-inferrer";

const arraySchema = {
  type: "array",
  items: {
    type: "string",
  },
} as const;
const array: InferJSONSchema<typeof arraySchema> = ["item"];
