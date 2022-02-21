import {
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
import { Mutable } from "./utilities";
/**
 * {@link https://json-schema.org/draft/2020-12/release-notes.html}
 */

export type InferTupleSchema<T, B = {}> =
  // Infer tuple
  T extends {
    prefixItems: [...infer U];
  }
    ? // Closed tuple
      T extends { items: false }
      ? InferTupleItemSchema<U, B>
      : // Tuple with constrained additional items
      T extends { items: infer A }
      ? [...InferTupleItemSchema<U, B>, InferJSONSchemaType<A, B>]
      : [...InferTupleItemSchema<U, B>, ...any[]]
    : never;
export type InferArraySchema<T, Base extends {}, E = never> = T extends {
  type: "array";
}
  ? T extends { items: infer I }
    ? I extends {}
      ? InferJSONSchemaType<I, Base>[]
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
export type InferJSONSchemaType<T, B extends {}> = WithSchemaConditions<
  T,
  | InferForValidationSchema<T, B>
  | InferPrimitiveJSONSchemaType<T>
  | InferObjectSchema<T, B>
  | InferTupleSchema<T, B>
  | InferArraySchema<T, B>
  | InferReferenceSchema<T, B>
>;
export type InferJSONSchemaVersionDraft2020_12<T, E> = T extends {
  $schema: `${infer P}://json-schema.org/draft/2020-12/schema${infer Q}`;
}
  ? InferJSONSchemaType<Mutable<T>, Mutable<T>>
  : E;
