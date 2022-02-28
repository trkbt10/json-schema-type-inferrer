/**
 * JSON Schema draft-06
 * {@link https://json-schema.org/draft-06/json-schema-release-notes.html}
 */

import type {
  ConcatJSONSchemaDefinitions,
  InferArraySchema,
  InferDefaultValue,
  InferForValidationSchema,
  InferNullable,
  InferObjectSchema,
  InferPrimitiveJSONSchemaType,
  InferReferenceSchema,
} from "./json-schema-draft-04";

export type InferExampleValues<T, V> = T extends { readonly example: infer E }
  ? E | V
  : V;

export type InferConstantValue<T, V> = T extends { readonly const: infer D }
  ? D
  : V;
export type WithSchemaConditions<S, T> = InferConstantValue<
  S,
  InferDefaultValue<S, InferNullable<S, T>>
>;
export type InferJSONSchemaType<T, R> = WithSchemaConditions<
  T,
  | InferForValidationSchema<T, R>
  | InferPrimitiveJSONSchemaType<T>
  | InferObjectSchema<T, R>
  | InferArraySchema<T, R>
  | InferReferenceSchema<T, R>
>;
export type InferJSONSchemaDraft06<T, Base = T, Root = T> = InferJSONSchemaType<
  T,
  ConcatJSONSchemaDefinitions<Root> & { "#": Base }
>;
export type InferJSONSchemaVersionDraft06<T, B, R, E> = T extends {
  readonly $schema: `${infer P}://json-schema.org/draft-06/schema${infer Q}`;
}
  ? InferJSONSchemaDraft06<T, B, R>
  : E;
