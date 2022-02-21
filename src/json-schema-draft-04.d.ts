import {
  Unpacked,
  Get,
  Split,
  Mutable,
  Join,
  DropLastIndex,
} from "./utilities";

export type InferNumberSchema<T, E = never> = T extends {
  type: "number" | "integer";
}
  ? number
  : E;
export type InferEnumDef<T, E = never> = T extends { enum: [...infer U] }
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
  type: "null";
}
  ? null
  : E;
export type InferBooleanSchema<T, E = never> = T extends {
  type: "boolean";
}
  ? boolean
  : E;
export type InferStringSchema<T, E = never> = T extends { type: "string" }
  ? string
  : E;
export type InferObjectPropertiesSchemaType<
  T,
  Base extends {},
  Root extends {},
  E = never
> = T extends {
  [key: string]: any;
}
  ? { [K in keyof T]: InferJSONSchemaType<T[K], Base, Root> }
  : E;

export type InferAdditionalPropertiesSchema<
  T extends {} | boolean,
  Base extends {},
  Root extends {},
  E = never
> = T extends boolean
  ? T extends true
    ? { [key: string]: any }
    : {}
  : { [key: string]: InferJSONSchemaType<T, Base, Root> };

export type InferRequiredProperties<T extends {}, Required extends keyof T> = {
  [R in Required]: T[R];
} & {
  [O in Exclude<keyof T, Required>]?: T[O];
};
export type InferRequiredKeys<
  P extends {},
  R extends (keyof Partial<P>)[]
> = keyof Pick<P, Unpacked<R>>;
export type InferObjectPropertiesSchema<
  T,
  Base extends {},
  E = never
> = T extends {
  properties?: infer P;
}
  ? P extends { [key: string]: any }
    ? T extends { required: string[] }
      ? InferRequiredProperties<
          InferObjectPropertiesSchemaType<P, Base, E>,
          InferRequiredKeys<P, T["required"]>
        >
      : InferObjectPropertiesSchemaType<P, Base, E>
    : {}
  : E;

export type InferObjectSchema<
  T,
  Base extends {},
  Root extends {},
  E = never
> = T extends {
  type: "object";
  properties?: infer P;
  additionalProperties?: infer AP;
}
  ?
      | InferObjectPropertiesSchema<T, Base>
      | InferAdditionalPropertiesSchema<AP, Base, E>
  : E;
export type GetObjectByLocalPath<T, K> = T extends {}
  ? K extends `/${infer P}`
    ? Get<T, Split<P>>
    : never
  : never;
export type GetObjectByPath<T, Root extends {}> = T extends string
  ? T extends `${infer B}#${infer L}`
    ? GetObjectByLocalPath<Get<Root, [B]>, L>
    : never
  : never;

export type InferReferenceSchema<
  T,
  Base extends {},
  Root extends {},
  E = never
> = T extends {
  $ref: infer R;
}
  ? R extends "#"
    ? InferJSONSchemaType<Base, Base, Root>
    : InferJSONSchemaType<
        GetObjectByPath<ComposeRefTargetURIFromSchema<T, Base>, Root>,
        Base
      >
  : E;

export type ComposeRefTargetURIFromSchema<T, B> = T extends {
  $ref: `${infer P}`;
}
  ? B extends { $id: infer Id }
    ? Id extends string
      ? `${Join<DropLastIndex<Split<Id, "/">>, "/">}${P}`
      : P
    : P
  : unknown;

export type InferTupleItemSchema<
  T extends any[],
  Base extends {},
  Root extends {}
> = T extends [infer U, ...infer U2]
  ? [
      InferJSONSchemaType<U, Base, Root>,
      ...InferTupleItemSchema<U2, Base, Root>
    ]
  : [];
export type InferArraySchema<
  T,
  Base extends {},
  Root extends {},
  E = never
> = T extends {
  type: "array";
}
  ? T extends { items: infer I }
    ? I extends {}
      ? InferJSONSchemaType<I, Base, Root>[]
      : I extends [...any]
      ? InferTupleItemSchema<I, Base, Root>
      : E
    : E
  : E;
export type InferNullable<T, V> = T extends { nullable: true } ? null | V : V;

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
export type ConcatTypes<T extends any[]> = T extends [infer U, ...infer U2]
  ? U & ConcatTypes<U2>
  : {};
export type MapForAllOfProperties<
  T extends any[],
  Base extends {},
  Root extends {}
> = InferJSONSchemaType<ConcatTypes<T>, Base, Root>;
export type MapForAnyOfProperties<
  T extends any[],
  Base extends {},
  Root extends {}
> = T extends [infer U, ...infer U2]
  ? InferJSONSchemaType<U, Base, Root> | MapForAnyOfProperties<U2, Base, Root>
  : never;
export type MapForOneOfProperties<
  T extends any[],
  Base extends {},
  Root extends {}
> = T extends [infer U, ...infer U2]
  ? InferJSONSchemaType<U, Base, Root> | MapForOneOfProperties<U2, Base, Root>
  : never;

export type InferForValidationSchema<
  T extends {},
  Base extends {},
  Root extends {}
> =
  | (T extends {
      allOf: any[];
    }
      ? MapForAllOfProperties<T["allOf"], Base, Root>
      : never)
  | (T extends {
      anyOf: any[];
    }
      ? MapForAnyOfProperties<T["anyOf"], Base, Root>
      : never)
  | (T extends {
      oneOf: any[];
    }
      ? MapForOneOfProperties<T["oneOf"], Base, Root>
      : never);

export type InferDefaultValue<T, V> = T extends { default: infer D }
  ? V | D
  : V;
export type InferJSONSchemaType<
  T extends {},
  Base extends {},
  Root = Base
> = InferDefaultValue<
  T,
  InferNullable<
    T,
    | InferForValidationSchema<T, Base, Root>
    | InferPrimitiveJSONSchemaType<T>
    | InferObjectSchema<T, Base, Root>
    | InferArraySchema<T, Base, Root>
    | InferReferenceSchema<T, Base, Root>
  >
>;
export type InferJSONSchema<T extends any, R = T> = InferJSONSchemaType<
  Mutable<T>,
  Mutable<T>,
  R extends any[]
    ? ConcatJSONSchemas<T extends { $id: string } ? [...R, T] : R>
    : R extends {}
    ? Mutable<R>
    : never
>;

export type InferJSONSchemaDraft04<T, R = T> = T extends {}
  ? InferJSONSchema<T, R>
  : {};

export type ConcatJSONSchemas<T extends { $id: string }[]> = T extends [
  infer A,
  ...infer B
]
  ? (A extends { $id: string } ? { [K in A["$id"]]: Mutable<A> } : {}) &
      (B extends any[] ? ConcatJSONSchemas<B> : {})
  : {};
export type InferJSONSchemaVersionDraft04<T, R extends {}, E> = T extends {
  $schema: `${infer P}://json-schema.org/draft-04/schema${infer P}`;
}
  ? InferJSONSchemaDraft04<T, R>
  : E;
