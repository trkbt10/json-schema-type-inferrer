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
export type InferJSONSchemaType<T, B extends {}> = WithSchemaConditions<
  T,
  | InferForValidationSchema<T, B>
  | InferPrimitiveJSONSchemaType<T>
  | InferObjectSchema<T, B>
  | InferArraySchema<T, B>
  | InferReferenceSchema<T, B>
>;
export type InferJSONSchemaDraft06<T> = T extends {}
  ? InferJSONSchemaType<Mutable<T>, Mutable<T>>
  : {};

export type InferJSONSchemaVersionDraft06<T, E> = T extends {
  $schema: `${infer P}://json-schema.org/draft-06/schema${infer P}`;
}
  ? InferJSONSchemaType<Mutable<T>, Mutable<T>>
  : E;
