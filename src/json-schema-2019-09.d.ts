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
import { InferObjectPropertiesSchema } from "./json-schema-draft-04";

type Deprecated<T> = { __message__: `The property is deprecated.` } | T;
type InferDeprecatedSchema<T, V> = T extends { deprecated: true }
  ? Deprecated<V>
  : V;
type DependentRequired<T, V> = T extends { dependentRequired: {} }
  ? {
      [K in keyof T["dependentRequired"]]: V[K];
    }
  : {};
export type InferDependentRequired<T, V> = T extends {
  properties: {};
  dependentRequired: {};
}
  ? T["dependentRequired"] extends {
      [key in keyof Partial<T["properties"]>]: (infer DK)[];
    }
    ? DK extends keyof T["properties"]
      ? V &
          (
            | (DependentRequired<T, V> & {
                [K2 in DK]: V[DK];
              })
            | DependentRequired<T, V>
          )
      : V
    : V
  : V;

export type InferDependentSchemas<T, V, Base, Root> = T extends {
  properties: {};
  dependentSchemas: {};
}
  ? T["dependentSchemas"] extends {
      [K in keyof T["dependentSchemas"]]: infer U;
    }
    ? U extends { properties: {} }
      ? Omit<V, keyof Omit<V, keyof T["dependentSchemas"]>> &
          (InferObjectPropertiesSchema<U, Base, Root> & {
            [P in keyof T["dependentSchemas"]]: V[P];
          })
      : V
    : V
  : V;

export type InferJSONSchemaType<
  T,
  Base extends {},
  Root extends {}
> = InferDependentSchemas<
  T,
  WithSchemaConditions<
    T,
    | InferForValidationSchema<T, Base, Root>
    | InferPrimitiveJSONSchemaType<T>
    | InferDependentRequired<T, InferObjectSchema<T, Base, Root>>
    | InferArraySchema<T, Base, Root>
    | InferReferenceSchema<T, Base, Root>
  >,
  Base,
  Root
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
