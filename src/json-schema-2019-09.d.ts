/**
 * JSON Schema 2019-09
 * {@link https://json-schema.org/draft/2019-09/release-notes.html}
 */

import type {
  ConcatJSONSchemaDefinitions,
  InferArraySchema,
  InferForValidationSchema,
  InferObjectSchema,
  InferPrimitiveJSONSchemaType,
  InferReferenceSchema,
} from "./json-schema-draft-04";
import { WithSchemaConditions } from "./json-schema-draft-07";
import { InferObjectPropertiesSchema } from "./json-schema-draft-04";

type Deprecated<T> = { __message__: `The property is deprecated.` } | T;
type InferDeprecatedSchema<T, V> = T extends { readonly deprecated: true }
  ? Deprecated<V>
  : V;
type DependentRequired<T, V> = T extends {
  readonly dependentRequired: {};
}
  ? {
      -readonly [K in keyof T["dependentRequired"]]: V[K];
    }
  : {};
export type InferDependentRequired<T, V> = T extends {
  readonly properties: {};
  readonly dependentRequired: {};
}
  ? T["dependentRequired"] extends {
      readonly [K in keyof Partial<T["properties"]>]: readonly (infer DK)[];
    }
    ? DK extends keyof T["properties"]
      ? Omit<V, keyof T["dependentRequired"] | DK> &
          (
            | DependentRequired<T, V>
            | (DependentRequired<T, V> & {
                [K2 in DK]: V[DK];
              })
          )
      : V
    : V
  : V;

export type InferDependentSchemas<T, V, Root = {}> = T extends {
  readonly properties: {};
  readonly dependentSchemas: {};
}
  ? T["dependentSchemas"] extends {
      readonly [K in keyof T["dependentSchemas"]]: infer U;
    }
    ? U extends { readonly properties: {} }
      ? Omit<V, keyof Omit<V, keyof T["dependentSchemas"]>> &
          (InferObjectPropertiesSchema<U, Root> & {
            -readonly [P in keyof T["dependentSchemas"]]: V[P];
          })
      : V
    : V
  : V;

export type InferJSONSchemaType<T, Root extends {}> = InferDependentSchemas<
  T,
  WithSchemaConditions<
    T,
    | InferForValidationSchema<T, Root>
    | InferPrimitiveJSONSchemaType<T>
    | InferDependentRequired<T, InferObjectSchema<T, Root>>
    | InferArraySchema<T, Root>
    | InferReferenceSchema<T, Root>
  >,
  Root
>;

export type InferJSONSchema201909<T, Base = T, R = T> = InferJSONSchemaType<
  T,
  ConcatJSONSchemaDefinitions<R> & { "#": Base }
>;

export type InferJSONSchemaVersion201909<T, Base, Root, E> = T extends {
  readonly $schema: `${infer P}://json-schema.org/2019-09/schema${infer P}`;
}
  ? InferJSONSchema201909<T, Base, Root>
  : E;
