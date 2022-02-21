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

type DependentRequiredSchema = InferJSONSchema<{
  type: "object";

  properties: {
    name: { type: "string" };
    credit_card: { type: "number" };
    billing_address: { type: "string" };
  };

  required: ["name"];

  dependentRequired: {
    credit_card: ["billing_address"];
  };
}>;
const object3: DependentRequiredSchema = {
  name: "John Doe",
  credit_card: 5555555555555555,
  billing_address: "555 Debtor's Lane",
};

// @ts-expect-error
const object3Invalid: DependentRequiredSchema = {
  name: "John Doe",
  credit_card: 5555555555555555,
};

const object3Valid2: DependentRequiredSchema = {
  name: "John Doe",
};
const object3Valid3: DependentRequiredSchema = {
  name: "John Doe",
  billing_address: "555 Debtor's Lane",
};
