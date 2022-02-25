import { InferJSONSchema } from "../src/json-schema-type-inferrer";

const schema = {
  $id: "https://example.com/schemas/customer",

  type: "object",
  properties: {
    first_name: { $ref: "#/$defs/name" },
    last_name: { $ref: "#/$defs/name" },
    shipping_address: { $ref: "/schemas/address" },
    billing_address: { $ref: "/schemas/address" },
  },
  required: ["first_name", "last_name", "shipping_address", "billing_address"],

  $defs: {
    name: { type: "string" },
  },
} as const;

type Schema = InferJSONSchema<
  typeof schema,
  typeof schema,
  [
    {
      $id: "https://example.com/schemas/address";
      type: "string";
    }
  ]
>;
const ref: Schema = {
  first_name: "joe",
  last_name: "doe",
  shipping_address: "shipping",
  billing_address: "billing",
};
