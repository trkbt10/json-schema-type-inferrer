/**
 * JSON Schema draft-07
 * {@link https://json-schema.org/draft-07/json-schema-release-notes.html}
 */

import type {
  InferArraySchema,
  InferDefaultValue,
  InferForValidationSchema,
  InferNullable,
  InferObjectSchema,
  InferPrimitiveJSONSchemaType,
  InferReferenceSchema,
} from "./json-schema-draft-04";
import type { Mutable } from "./utilities";

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
export type InferJSONSchemaType<T, B extends {}> = WithSchemaConditions<
  T,
  | InferForValidationSchema<T, B>
  | InferPrimitiveJSONSchemaType<T>
  | InferObjectSchema<T, B>
  | InferArraySchema<T, B>
  | InferReferenceSchema<T, B>
>;
export type InferJSONSchemaDraft07<T> = T extends {}
  ? InferJSONSchemaType<Mutable<T>, Mutable<T>>
  : {};

export type InferJSONSchemaVersionDraft07<T, E> = T extends {
  $schema: `${infer P}://json-schema.org/draft-07/schema${infer P}`;
}
  ? InferJSONSchemaType<Mutable<T>, Mutable<T>>
  : E;
