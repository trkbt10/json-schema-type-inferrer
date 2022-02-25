import {
  ComposeRefTargetURIFromSchema,
  ConcatJSONSchemaDefinitions,
  GetObjectByLocalPath,
  GetObjectByPath,
  InferJSONSchemaDraft04,
  InferObjectSchema,
  InferReferenceSchema,
} from "../../src/json-schema-draft-04";
import { Mutable, Split } from "../../src/utilities";

describe("ReferenceSchema", () => {
  it("string type", () => {
    const schema = {
      definitions: {
        text: {
          type: "string",
        },
      },
      type: "array",
      items: {
        $ref: "#/definitions/text",
      },
    } as const;
    type Schema = Mutable<typeof schema>;
    type TextSchema = InferJSONSchemaDraft04<Schema>;
    type Root = { "#": Schema };
    type RefTarget = ComposeRefTargetURIFromSchema<Schema["items"], Schema>;
    type ResolvedLocalPath = GetObjectByLocalPath<Schema, "/definitions/text">;
    type ResolvedSchema = GetObjectByPath<RefTarget, Root>;
    type RefSchema = InferReferenceSchema<Schema["items"], Root>;
    const type: TextSchema = ["string"];
  });
  it("Use outside schemas", () => {
    const schemaA = {
      $id: "https://example.com/A",
      $defs: {
        A: {
          type: "string",
        },
      },
    } as const;
    const schemaB = {
      $id: "https://example.com/B",
      type: "string",
    } as const;
    const localSchema = {
      $id: "https://example.com/C",
      type: "object",
      properties: {
        a: {
          type: "string",
        },
        ref: {
          $ref: "A#/$defs/A",
        },
        ref2: {
          $ref: "B",
        },
      },
      additionalProperties: false,
    } as const;
    type Schema = Mutable<typeof localSchema>;
    type UnifiedJSONSchemas = ConcatJSONSchemaDefinitions<
      [typeof schemaB, typeof schemaA]
    > & { "#": Schema };
    type RefSchemaExternals = InferReferenceSchema<
      Schema["properties"]["ref"],
      UnifiedJSONSchemas
    >;
    type ComposedRefTargetURI = ComposeRefTargetURIFromSchema<
      {
        $ref: "A#/$defs/A";
      },
      UnifiedJSONSchemas["#"]
    >;
    type ComposedRefTargetURI2 = ComposeRefTargetURIFromSchema<
      {
        $ref: "/B";
      },
      UnifiedJSONSchemas["#"]
    >;
    type ResolcedRef2 = GetObjectByPath<
      ComposedRefTargetURI2,
      UnifiedJSONSchemas
    >;
    type Basename<T> = T extends `${infer Protocol}//${infer LocationWithPaths}`
      ? `${Protocol}//${Split<LocationWithPaths, "/">[0]}`
      : never;
    const basename: Basename<"https://example.com/paths/children"> =
      "https://example.com";

    const expectedURI: ComposedRefTargetURI = "https://example.com/A#/$defs/A";
    type RefSchema = InferObjectSchema<Schema, UnifiedJSONSchemas>;
  });
});
