/**
 * JSON Schema draft-06
 * {@link https://json-schema.org/draft-06/json-schema-release-notes.html}
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
export type WithSchemaConditions<S, T> = InferConstantValue<
  S,
  InferDefaultValue<S, InferNullable<S, T>>
>;
export type InferJSONSchemaType<T, B = {}, R = B> = WithSchemaConditions<
  T,
  | InferForValidationSchema<T, B, R>
  | InferPrimitiveJSONSchemaType<T>
  | InferObjectSchema<T, B, R>
  | InferArraySchema<T, B, R>
  | InferReferenceSchema<T, B, R>
>;
export type InferJSONSchemaDraft06<T, R = T> = T extends {}
  ? InferJSONSchemaType<Mutable<T>, Mutable<T>, R>
  : {};

export type InferJSONSchemaVersionDraft06<T, R, E> = T extends {
  $schema: `${infer P}://json-schema.org/draft-06/schema${infer P}`;
}
  ? InferJSONSchemaType<Mutable<T>, Mutable<T>, R>
  : E;
