import type { InferJSONSchema } from "../src/json-schema-type-inferrer";

const objectSchema = {
  type: "object",
  properties: {
    item: {
      type: "string",
    },
    nullable: {
      type: "number",
      nullable: true,
    },
  },
  required: ["item"],
} as const;
const object: InferJSONSchema<typeof objectSchema> = {
  item: "value",
  nullable: 0,
};

const additionalProperties = {
  type: "object",
  properties: {
    item: {
      type: "string",
    },
  },
  additionalProperties: {
    type: "string",
  },
  required: ["item"],
} as const;

const object2: InferJSONSchema<typeof additionalProperties> = {
  item: "value",
  additional: "value",
};
