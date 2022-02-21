import type { InferJSONSchema } from "../src/json-schema-type-inferrer";

const arraySchema = {
  type: "array",
  items: {
    type: "string",
  },
} as const;
const array: InferJSONSchema<typeof arraySchema> = ["item"];

const tupleSchema = {
  type: "array",
  prefixItems: [
    {
      type: "string",
    },
    {
      type: "number",
    },
  ],
} as const;
const tuple: InferJSONSchema<typeof tupleSchema> = ["item", 1];

const containingRefsArraySchema = {
  type: "array",
  items: {
    $ref: "#/$defs/itemType",
  },
  $defs: {
    itemType: {
      type: "string",
    },
  },
} as const;
const array2: InferJSONSchema<typeof containingRefsArraySchema> = ["item"];

const containingRefsTupleSchema = {
  type: "array",
  prefixItems: [
    {
      $ref: "#/$defs/a",
    },
    {
      $ref: "#/$defs/b",
    },
  ],
  $defs: {
    a: {
      type: "string",
    },
    b: {
      type: "number",
    },
  },
} as const;
const tuple2: InferJSONSchema<typeof containingRefsTupleSchema> = ["item", 1];
