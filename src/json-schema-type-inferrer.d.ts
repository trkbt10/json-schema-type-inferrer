type Unpacked<T> = T extends (infer U)[] ? U : T;

type Mutable<T> = {
  -readonly [K in keyof T]: Mutable<T[K]>;
};

type InferNumberSchema<T, E = unknown> = T extends {
  type: "number" | "float" | "integer" | "double";
}
  ? number
  : E;
type InferStringSchema<T, E = unknown> = T extends { type: "string" }
  ? string
  : E;
type InferObjectPropertiesSchemaType<T, E = unknown> = T extends {
  [key: string]: any;
}
  ? { [K in keyof T]: InferJSONSchemaType<T[K], E> }
  : E;

type InferAdditionalPropertiesSchema<
  T extends {} | boolean,
  E = unknown
> = T extends boolean
  ? T extends true
    ? { [key: string]: any }
    : {}
  : T extends { type: string }
  ? { [key: string]: InferJSONSchema<T> }
  : E;

type InferRequiredProperties<T extends {}, Required extends keyof T> = {
  [R in Required]: T[R];
} & {
  [O in Exclude<keyof T, Required>]?: T[O];
};
type InferRequiredKeys<
  P extends {},
  R extends (keyof Partial<P>)[]
> = keyof Pick<P, Unpacked<R>>;
type InferPrimitiveSchemasAllOf<T extends any[]> = T extends [
  infer U,
  ...infer U2
]
  ?
      | InferJSONSchema<U>
      | (U2 extends [] ? InferJSONSchema<U> : InferPrimitiveSchemasAllOf<U2>)
  : unknown;
type InferObjectSchemasAllOf<T extends any[]> = T extends [infer U, ...infer U2]
  ? InferObjectPropertiesSchema<U> &
      (U2 extends []
        ? InferObjectPropertiesSchema<U>
        : InferObjectSchemasAllOf<U2>)
  : unknown;
type InferObjectSchemasOneOf<T extends any[]> = T extends [infer U, ...infer U2]
  ?
      | InferObjectPropertiesSchema<U>
      | (U2 extends []
          ? InferObjectPropertiesSchema<U>
          : InferObjectSchemasOneOf<U2>)
  : unknown;
type InferObjectSchemasAnyOf<T extends any[]> = T extends [infer U, ...infer U2]
  ?
      | InferObjectPropertiesSchema<U>
      | (U2 extends []
          ? InferObjectPropertiesSchema<U>
          : InferObjectSchemasAnyOf<U2>)
  : unknown;

type InferObjectPropertiesSchema<T, E = unknown> = T extends {
  properties?: infer P;
  additionalProperties?: infer AP;
}
  ? P extends { [key: string]: any }
    ? T extends { required: string[] }
      ? InferRequiredProperties<
          InferObjectPropertiesSchemaType<P, E>,
          InferRequiredKeys<P, T["required"]>
        >
      : InferObjectPropertiesSchemaType<P, E>
    : {}
  : E;

type InferObjectSchema<T, E = unknown> = T extends {
  type: "object";
  properties?: infer P;
  additionalProperties?: infer AP;
  allOf?: any[];
  anyOf?: any[];
  oneOf?: any[];
}
  ? (InferObjectPropertiesSchema<T> & InferAdditionalPropertiesSchema<AP, E>) &
      (T extends { allOf: any[] } ? InferObjectSchemasAllOf<T["allOf"]> : {}) &
      (T extends { anyOf: any[] } ? InferObjectSchemasAnyOf<T["anyOf"]> : {}) &
      (T extends { oneOf: any[] } ? InferObjectSchemasOneOf<T["oneOf"]> : {})
  : E;
type InferReferenceSchema<T, E = unknown> = T extends { $ref: infer R } ? R : E;
type InferTupleSchema<T extends any[]> = T extends [infer U, ...infer U2]
  ? [InferJSONSchema<U>, ...InferTupleSchema<U2>]
  : [];
type InferArraySchema<T, E = unknown> = T extends {
  type: "array";
}
  ? T extends { items: infer I }
    ? I extends { type: string }
      ? InferJSONSchema<I>[]
      : I extends [...any]
      ? InferTupleSchema<I>
      : E
    : E
  : E;
type InferNullable<T, V> = T extends { nullable: true } ? null | V : V;

type InferJSONSchemaType<T extends any, E = unknown> = InferNullable<
  T,
  InferReferenceSchema<
    T,
    InferStringSchema<
      T,
      InferNumberSchema<T, InferObjectSchema<T, InferArraySchema<T, E>>>
    >
  >
>;

export type InferJSONSchema<T extends any> = InferJSONSchemaType<Mutable<T>>;
