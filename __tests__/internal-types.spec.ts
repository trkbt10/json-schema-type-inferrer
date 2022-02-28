import {
  ConcatJSONSchemaDefinitions,
  GetObjectByLocalPath,
} from "../src/json-schema-draft-04";
import { Mutable } from "../src/utilities";
import { GetObjectByPath } from "../src/json-schema-draft-04";
describe("Internal Types", () => {
  const schemaA = {
    $id: "https://example.com/A",
    definitions: {
      A: {
        type: "string",
      },
    },
  } as const;
  const schemaB = {
    $id: "https://example.com/B",
    definitions: {
      B: {
        type: "string",
      },
    },
  } as const;
  type UnifiedJSONSchemas = ConcatJSONSchemaDefinitions<
    [typeof schemaB, typeof schemaA]
  >;
  it("ConcatJSONSchemaDefinitions", () => {
    const typedSchemaA: UnifiedJSONSchemas["https://example.com/A"] = schemaA;
    const typedSchemaB: UnifiedJSONSchemas["https://example.com/B"] = schemaB;
    // @ts-expect-error
    const typedSchema: UnifiedJSONSchemas["https://example.com/A"] = schemaB;

    const localSchema = {
      type: "object",
      properties: {
        item: {
          type: "string",
        },
      },
    } as const;
    type LocalType = ConcatJSONSchemaDefinitions<typeof localSchema> & {
      "#": typeof localSchema;
    };
    const typedLocalSchema: LocalType["#"] = localSchema;
  });
  it("GetObjectByLocalPath", () => {
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
    type Schema = typeof schema;
    type ResolvedLocalPath = GetObjectByLocalPath<Schema, "/definitions/text">;
    const resolvedSchema: ResolvedLocalPath = schema.definitions.text;
    const resolveConcatedSchema: ResolvedLocalPath = schema.definitions.text;
  });
  it("GetObjectByPath", () => {
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
    type Schema = typeof schema;
    type ResolvedLocalPath = GetObjectByPath<
      "#/definitions/text",
      {
        "#": Schema;
      }
    >;
    const resolvedSchema: ResolvedLocalPath = schema.definitions.text;

    type ResolvedSchema = GetObjectByPath<
      "/definitions/text",
      ConcatJSONSchemaDefinitions<
        [typeof schema, typeof schemaB, typeof schemaA]
      >
    >;
    const resolveConcatedSchema: ResolvedLocalPath = schema.definitions.text;
  });
});
