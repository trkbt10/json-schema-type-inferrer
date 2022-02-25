import {
  ConcatJSONSchemas,
  InferJSONSchemaType,
  InferReferenceSchema,
} from "../../src/json-schema-draft-04";
import { Mutable } from "../../src/utilities";
import { schema as content } from "./schemas/content";
import { schema as core } from "./schemas/core";
import { schema as format } from "./schemas/format";
import { schema as metaData } from "./schemas/meta-data";
import { schema } from "./schemas/schema";
import { schema as validation } from "./schemas/validation";
import { ComposeRefTargetURIFromSchema } from "../../src/json-schema-draft-04";
import { InferJSONSchema201909 } from "../../src/json-schema-2019-09";
it("JSONSchema 2019-09", () => {
  type BaseSchema = Mutable<typeof schema>;
  type Schemas = [
    typeof content,
    typeof core,
    typeof format,
    typeof metaData,
    typeof validation
  ];
  //  type JSONSchema = InferJSONSchema201909<typeof schema, Schema>;
  type JSONSchema = InferJSONSchema201909<BaseSchema, Schemas>;
  type Type = InferJSONSchemaType<
    {
      type: "object";
      properties: {
        a: {
          type: "string";
        };
        ref: {
          $ref: "meta/validation#/$defs/stringArray";
        };
      };
    },
    ConcatJSONSchemas<Schemas>
  >;
  type Ref = InferReferenceSchema<
    {
      $ref: "meta/validation#/$defs/stringArray";
    },
    BaseSchema,
    ConcatJSONSchemas<Schemas>
  >;
  type uri = ComposeRefTargetURIFromSchema<
    {
      $ref: "meta/validation#/$defs/stringArray";
    },
    BaseSchema
  >;
});
