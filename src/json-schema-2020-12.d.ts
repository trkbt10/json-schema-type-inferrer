import {
  ConcatJSONSchemaDefinitions,
  InferBooleanSchema,
  InferEnumDef,
  InferForValidationSchema,
  InferNullSchema,
  InferNumberSchema,
  InferObjectSchema,
  InferReferenceSchema,
  InferStringSchema,
  InferTupleItemSchema,
} from "./json-schema-draft-04";
import { WithSchemaConditions } from "./json-schema-draft-07";
/**
 * {@link https://json-schema.org/draft/2020-12/release-notes.html}
 */

export type InferTupleSchema<T, B = {}, Root = B> =
  // Infer tuple
  T extends {
    prefixItems: [...infer U];
  }
    ? // Closed tuple
      T extends { items: false }
      ? InferTupleItemSchema<U, Root>
      : // Tuple with constrained additional items
      T extends { items: infer A }
      ? [...InferTupleItemSchema<U, Root>, InferJSONSchemaType<A, Root>]
      : [...InferTupleItemSchema<U, Root>, ...any[]]
    : never;
export type InferArraySchema<T, Root, E = never> = T extends {
  type: "array";
}
  ? T extends { items: infer I }
    ? I extends {}
      ? InferJSONSchemaType<I, Root>[]
      : E
    : E
  : E;
export type UnpackMultipleTypes<T extends any[]> = T extends [
  infer U,
  ...infer U2
]
  ? InferPrimitiveJSONSchemaType<{ type: U }> | UnpackMultipleTypes<U2>
  : never;
export type InferMultipleTypeSchema<T, E = never> = T extends {
  type: [...infer U];
}
  ? UnpackMultipleTypes<U>
  : E;

export type InferPrimitiveJSONSchemaType<T> =
  | InferMultipleTypeSchema<T>
  | InferEnumDef<T>
  | InferBooleanSchema<T>
  | InferStringSchema<T>
  | InferNumberSchema<T>
  | InferNullSchema<T>;
export type InferJSONSchemaType<T, Root> = WithSchemaConditions<
  T,
  | InferForValidationSchema<T, Root>
  | InferPrimitiveJSONSchemaType<T>
  | InferObjectSchema<T, Root>
  | InferTupleSchema<T, Root>
  | InferArraySchema<T, Root>
  | InferReferenceSchema<T, Root>
>;
export type InferJSONSchema2020_12<T, Base = T, R = T> = InferJSONSchemaType<
  T,
  ConcatJSONSchemaDefinitions<R> & { "#": Base }
>;

export type InferJSONSchemaVersionDraft2020_12<
  T,
  Base,
  Root,
  E = never
> = T extends {
  $schema: `${infer P}://json-schema.org/draft/2020-12/schema${infer Q}`;
}
  ? InferJSONSchema2020_12<T, Base, Root>
  : E;
