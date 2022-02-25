/**
 * JSON Schema draft-07
 * {@link https://json-schema.org/draft-07/json-schema-release-notes.html}
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

export type InferExampleValues<T, V> = T extends { example: infer E }
  ? E | V
  : V;

export type InferConstantValue<T, V> = T extends { const: infer D } ? D : V;
export type InferReadOnly<T, V> = T extends { readOnly: true }
  ? V extends {}
    ? Readonly<V>
    : V
  : V;

export type InferWriteOnly<T, V> = T extends { writeOnly: true }
  ? V extends {}
    ? V
    : V
  : V;
export type WithSchemaConditions<S, T> = InferReadOnly<
  T,
  InferConstantValue<S, InferDefaultValue<S, InferNullable<S, T>>>
>;
export type InferJSONSchemaType<T, R> = WithSchemaConditions<
  T,
  | InferForValidationSchema<T, R>
  | InferPrimitiveJSONSchemaType<T>
  | InferObjectSchema<T, R>
  | InferArraySchema<T, R>
  | InferReferenceSchema<T, R>
>;
export type InferJSONSchemaDraft07<T, Base = T, R = T> = InferJSONSchemaType<
  T,
  ConcatJSONSchemaDefinitions<R> & { "#": Base }
>;

export type InferJSONSchemaVersionDraft07<T, Base, R, E> = T extends {
  $schema: `${infer P}://json-schema.org/draft-07/schema${infer P}`;
}
  ? InferJSONSchemaDraft07<T, Base, R>
  : E;
