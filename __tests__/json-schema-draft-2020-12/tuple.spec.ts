import { InferTupleSchema } from "../../src/json-schema-2020-12";
it("Tuple type", () => {
  type OpenTuple = InferTupleSchema<{
    prefixItems: [{ type: "string" }, { type: "number" }];
  }>;
  type ClosedTuple = InferTupleSchema<{
    prefixItems: [{ type: "string" }, { type: "number" }];
    items: false;
  }>;
  type TupleWithConstrainedAdditionalItems = InferTupleSchema<{
    prefixItems: [{ type: "string" }, { type: "number" }];
    items: { type: "string" };
  }>;

  const openTuple: OpenTuple = ["string", 1];
  const openTuple2: OpenTuple = ["string", 1, 1];
  // @ts-expect-error
  const openTuple3: OpenTuple = [1, "string", 1];

  const closedTuple: ClosedTuple = ["string", 1];

  // @ts-expect-error
  const closedTuple2: ClosedTuple = ["string", 1, "string"];

  const tupleWithConstrainedAdditionalItems: TupleWithConstrainedAdditionalItems =
    ["string", 1, "string"];

  const tupleWithConstrainedAdditionalItems2: TupleWithConstrainedAdditionalItems =
    [
      "string",
      1,
      // @ts-expect-error
      2,
    ];
});
