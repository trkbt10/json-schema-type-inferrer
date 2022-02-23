import { InferJSONSchemaDraft04 } from "../../src/json-schema-draft-04";
it("dependentRequired", () => {
  type Schema = InferJSONSchemaDraft04<{
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
});
