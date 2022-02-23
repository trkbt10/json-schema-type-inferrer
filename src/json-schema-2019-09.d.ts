/**
 * JSON Schema 2019-09
 * {@link https://json-schema.org/draft/2019-09/release-notes.html}
 */

import type {
  InferArraySchema,
  InferForValidationSchema,
  InferObjectSchema,
  InferPrimitiveJSONSchemaType,
  InferReferenceSchema,
} from "./json-schema-draft-04";
import { WithSchemaConditions } from "./json-schema-draft-07";

type Deprecated<T> = { __message__: `The property is deprecated.` } | T;
type InferDeprecatedSchema<T, V> = T extends { deprecated: true }
  ? Deprecated<V>
  : V;
export type InferJSONSchemaType<
  T,
  Base extends {},
  Root extends {}
> = WithSchemaConditions<
  T,
  | InferForValidationSchema<T, Base, Root>
  | InferPrimitiveJSONSchemaType<T>
  | InferObjectSchema<T, Base, Root>
  | InferArraySchema<T, Base, Root>
  | InferReferenceSchema<T, Base, Root>
>;

export type InferJSONSchema201909<T, Root extends {}> = InferJSONSchemaType<
  T,
  T,
  Root
>;

export type InferJSONSchemaVersion201909<T, R extends {}, E> = T extends {
  $schema: `${infer P}://json-schema.org/2019-09/schema${infer P}`;
}
  ? InferJSONSchema201909<T, R>
  : E;
