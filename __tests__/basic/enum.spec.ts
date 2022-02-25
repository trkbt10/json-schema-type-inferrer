import {
  InferJSONSchema2020_12,
  InferPrimitiveJSONSchemaType,
} from "../../src/json-schema-2020-12";
import { InferEnumDef } from "../../src/json-schema-draft-04";
import { Mutable } from "../../src/utilities";
describe("Enum", () => {
  it("InferEnumDef", () => {
    const enums: InferEnumDef<
      {
        enum: ["a", "b", "c"];
      },
      any
    > = "a";
    const enums2: InferEnumDef<
      {
        type: "string";
      },
      {
        type: "string";
      }
    > = { type: "string" };
  });
  it("InferPrimitiveJSONSchemaType", () => {
    const schema = {
      type: "number",
      enum: [1, 2, 3],
    } as const;
    type Schema = Mutable<typeof schema>;
    const enums: InferPrimitiveJSONSchemaType<Schema> = 1;
    const enums2: InferJSONSchema2020_12<Schema> = 1;
    const schema2 = {
      enum: [
        "array",
        "boolean",
        "integer",
        "null",
        "number",
        "object",
        "string",
      ],
    } as const;
    type Schema2 = Mutable<typeof schema2>;
    const strEnums: InferPrimitiveJSONSchemaType<Schema2> = "array" as const;
    const strEnums2: InferJSONSchema2020_12<Schema2> = "string";
  });
  it("nullable enum", () => {
    const schema = {
      enum: [
        "array",
        "boolean",
        "integer",
        "null",
        "number",
        "object",
        "string",
      ],
      nullable: true,
    } as const;
    type Schema = Mutable<typeof schema>;
    const type: InferPrimitiveJSONSchemaType<Schema> = "array" as const;
    const type2: InferJSONSchema2020_12<Schema> = null;
  });
});
