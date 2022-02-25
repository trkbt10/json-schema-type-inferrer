import type { InferDependentSchemas } from "../../src/json-schema-2019-09";
it("dependentSchemas", () => {
  type Schema = {
    type: "object";

    properties: {
      name: { type: "string" };
      credit_card: { type: "number" };
    };

    required: ["name"];

    dependentSchemas: {
      credit_card: {
        properties: {
          billing_address: { type: "string" };
        };
        required: ["billing_address"];
      };
    };
  };
  type RequiredProperties = InferDependentSchemas<
    Schema,
    { name: string; credit_card: number }
  >;
  const valid: RequiredProperties = {
    credit_card: 5555555555555555,
    billing_address: "555 Debtor's Lane",
  };
  // @ts-expect-error
  const invalid: RequiredProperties = {
    credit_card: 5555555555555555,
  };
});
