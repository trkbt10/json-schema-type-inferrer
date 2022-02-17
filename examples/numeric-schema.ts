import { InferJSONSchema } from "../src/json-schema-type-inferrer";

const integerSchema = {
  type: "integer",
} as const;
const integer: InferJSONSchema<typeof integerSchema> = 1; // number

const numberSchema = {
  type: "number",
} as const;
const number: InferJSONSchema<typeof numberSchema> = 1; // number
