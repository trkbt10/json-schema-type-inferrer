import {
  InferDependentRequired,
  InferJSONSchema201909,
} from "../../src/json-schema-2019-09";
import { InferRequiredProperties } from "../../src/json-schema-draft-04";

it("dependentRequired", () => {
  const schema = {
    type: "object",

    properties: {
      name: { type: "string" },
      credit_card: { type: "number" },
      billing_address: { type: "string" },
    },

    required: ["name"],

    dependentRequired: {
      credit_card: ["billing_address"],
    },
  } as const;
  type Schema = typeof schema;
  type Required = InferRequiredProperties<
    {
      name: string;
      credit_card: number;
      billing_address: string;
    },
    {
      readonly required: readonly ["name"];
    }
  >;
  type Address = InferJSONSchema201909<typeof schema>;
  const valid: Address = {
    name: "John Doe",
    credit_card: 5555555555555555,
    billing_address: "555 Debtor's Lane",
  };
  type R = InferDependentRequired<
    typeof schema,
    {
      name: string;
      credit_card: number;
      billing_address?: string;
    }
  >;
  const value: R = {
    name: "John Doe",
    credit_card: 5555555555555555,
  };
  // @ts-expect-error
  const value2: R = {
    name: "John Doe",
    billing_address: "555 Debtor's Lane",
  };
  const value3: R = {
    name: "John Doe",
    billing_address: "555 Debtor's Lane",
    credit_card: 5555555555555555,
  };
});
