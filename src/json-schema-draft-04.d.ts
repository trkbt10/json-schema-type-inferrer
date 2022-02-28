import type { Unpacked, Get, Split, Join, DropLastIndex } from "./utilities";
import { Mutable } from "./utilities";

export type InferNumberSchema<T, E = never> = T extends {
  readonly type: "number" | "integer";
}
  ? number
  : E;
export type InferEnumDef<T, E = never> = T extends {
  readonly enum: readonly [...infer U];
}
  ? Unpacked<U>
  : E;

export type InferAnySchema<T> = T extends {
  length: number;
}
  ? any
  : T extends true
  ? any
  : T extends false
  ? never
  : T;
export type InferNullSchema<T, E = never> = T extends {
  readonly type: "null";
}
  ? null
  : E;
export type InferBooleanSchema<T, E = never> = T extends {
  readonly type: "boolean";
}
  ? boolean
  : E;
export type InferStringSchema<T, E = never> = T extends {
  readonly type: "string";
}
  ? string
  : E;
export type InferObjectPropertiesSchemaType<
  T,
  Root extends {},
  E = never
> = T extends {
  readonly [key: string]: any;
}
  ? { [K in keyof T]: InferJSONSchemaType<T[K], Root> }
  : E;

export type InferAdditionalPropertiesSchema<
  T extends {} | boolean,
  Root extends {},
  E = never
> = T extends boolean
  ? T extends true
    ? { [key: string]: any }
    : E
  : T extends { readonly additionalProperties: infer U }
  ? { [key: string]: InferJSONSchemaType<U, Root> }
  : E;

export type InferRequiredProperties<V extends {}, T extends {}> = T extends {
  readonly required: readonly (keyof V)[];
}
  ? {
      [K in T["required"][number]]: V[K];
    } & {
      [O in Exclude<keyof V, T["required"][number]>]?: V[O];
    }
  : V;

export type InferRequiredKeys<
  P extends {},
  R extends (keyof Partial<P>)[]
> = keyof Pick<P, Unpacked<R>>;
export type InferObjectPropertiesSchema<
  T,
  Root extends {},
  E = never
> = T extends {
  readonly properties?: infer P;
}
  ? P extends { readonly [key: string]: any }
    ? InferObjectPropertiesSchemaType<P, Root, E>
    : E
  : E;

export type InferObjectSchema<T, Root extends {}, E = never> = T extends {
  readonly type: "object";
}
  ? InferRequiredProperties<
      | InferObjectPropertiesSchema<T, Root, E>
      | InferAdditionalPropertiesSchema<T, Root, E>,
      T
    >
  : E;
export type InferDependentRequired<T, V> = T extends {
  readonly properties: {};
  readonly dependencies: {};
}
  ? T["dependencies"] extends {
      readonly [key in keyof Partial<T["properties"]>]: readonly (infer DK)[];
    }
    ? DK extends keyof T["properties"]
      ?
          | ({
              [K in keyof T["dependencies"]]: V[K];
            } & {
              [K2 in DK]: V[DK];
            })
          | {
              [K in keyof T["dependencies"]]: V[K];
            }
      : V
    : V
  : V;
export type GetObjectByLocalPath<T, K> = T extends {}
  ? K extends `/${infer P}`
    ? Get<T, Split<P>>
    : never
  : never;
export type GetObjectByPath<T, Root extends {}> = T extends string
  ? T extends `#${infer L}`
    ? GetObjectByLocalPath<Get<Root, ["#"]>, L>
    : T extends `${infer B}#${infer L}`
    ? GetObjectByLocalPath<Get<Root, [B]>, L>
    : T extends string
    ? Get<Root, [T]>
    : never
  : never;

type Basename<T> = T extends `${infer Protocol}//${infer LocationWithPaths}`
  ? `${Protocol}//${Split<LocationWithPaths, "/">[0]}`
  : never;
export type InferReferenceSchema<T, Root, E = never> = T extends {
  $ref: infer R;
}
  ? R extends "#"
    ? InferJSONSchemaType<GetObjectByLocalPath<"#", Root>, Root>
    : R extends `#${infer P}`
    ? InferJSONSchemaType<GetObjectByPath<`#${P}`, Root>, Root>
    : InferJSONSchemaType<
        GetObjectByPath<
          ComposeRefTargetURIFromSchema<T, Get<Root, ["#"]>>,
          Root
        >,
        Root
      >
  : E;

export type ComposeRefTargetURIFromSchema<T, B> = T extends {
  readonly $ref: `${infer P}`;
}
  ? B extends { readonly $id: infer Id }
    ? Id extends string
      ? P extends `/${infer P2}`
        ? `${Basename<Id>}/${P2}`
        : `${Join<DropLastIndex<Split<Id, "/">>, "/">}${P}`
      : P
    : P
  : unknown;

export type InferTupleItemSchema<
  T extends any[],
  Root extends {}
> = T extends readonly [infer U, ...infer U2]
  ? [InferJSONSchemaType<U, Root>, ...InferTupleItemSchema<U2, Root>]
  : [];
export type InferArraySchema<T, Root extends {}, E = never> = T extends {
  readonly type: "array";
}
  ? T extends { readonly items: infer I }
    ? I extends {}
      ? InferJSONSchemaType<I, Root>[]
      : I extends [...any]
      ? InferTupleItemSchema<I, Root>
      : E
    : E
  : E;
export type InferNullable<T extends {}, V = never> = T extends {
  readonly nullable: true;
}
  ? null | V
  : V;

export type UnpackMultipleTypes<T extends any[]> = T extends [
  infer U,
  ...infer U2
]
  ? InferPrimitiveJSONSchemaType<{ type: U }> | UnpackMultipleTypes<U2>
  : never;
export type InferMultipleTypeSchema<T, E = never> = T extends {
  readonly type: readonly [...infer U];
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
export type ConcatTypes<T extends readonly any[]> = T extends readonly [
  infer U,
  ...infer U2
]
  ? U & ConcatTypes<U2>
  : {};
export type MapForAllOfProperties<
  T extends readonly any[],
  Root extends {}
> = InferJSONSchemaType<ConcatTypes<T>, Root>;
export type MapForAnyOfProperties<
  T extends readonly any[],
  Root extends {}
> = T extends readonly [infer U, ...infer U2]
  ? InferJSONSchemaType<U, Root> | MapForAnyOfProperties<U2, Root>
  : never;
export type MapForOneOfProperties<
  T extends readonly any[],
  Root extends {}
> = T extends readonly [infer U, ...infer U2]
  ? InferJSONSchemaType<U, Root> | MapForOneOfProperties<U2, Root>
  : never;

export type InferForValidationSchema<T extends {}, Root extends {}> =
  | (T extends {
      readonly allOf: readonly any[];
    }
      ? MapForAllOfProperties<T["allOf"], Root>
      : never)
  | (T extends {
      readonly anyOf: readonly any[];
    }
      ? MapForAnyOfProperties<T["anyOf"], Root>
      : never)
  | (T extends {
      readonly oneOf: readonly any[];
    }
      ? MapForOneOfProperties<T["oneOf"], Root>
      : never);

export type InferDefaultValue<T, V> = T extends { default: infer D }
  ? V | D
  : V;
export type InferJSONSchemaType<T extends {}, Root = {}> = InferDefaultValue<
  T,
  InferNullable<
    T,
    | InferPrimitiveJSONSchemaType<T>
    | InferDependentRequired<T, InferObjectSchema<T, Root>>
    | InferArraySchema<T, Root>
    | InferReferenceSchema<T, Root>
    | InferForValidationSchema<T, Root>
  >
>;
export type ConcatJSONSchemas<T extends {}[]> = T extends [infer A, ...infer B]
  ? (A extends { readonly $id: string }
      ? { readonly [K in A["$id"]]: A }
      : {}) &
      (B extends any[] ? ConcatJSONSchemas<B> : {})
  : {};
export type ConcatJSONSchemaDefinitions<R> = R extends any[]
  ? ConcatJSONSchemas<[...R]>
  : R extends {}
  ? ConcatJSONSchemas<[R]>
  : never;
export type InferJSONSchema<T, Base = T, R = T> = InferJSONSchemaType<
  T,
  ConcatJSONSchemaDefinitions<R> & { "#": Base }
>;

export type InferJSONSchemaDraft04<T, Base = T, R = T, E = never> = T extends {}
  ? InferJSONSchema<T, Base, R>
  : E;

export type InferJSONSchemaVersionDraft04<
  T,
  B = T,
  R = T,
  E = never
> = T extends {
  readonly $schema: `${infer P}://json-schema.org/draft-04/schema${infer P}`;
}
  ? InferJSONSchemaDraft04<T, B, R, E>
  : E;
