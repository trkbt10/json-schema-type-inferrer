type Unpacked<T> = T extends (infer U)[] ? U : T;

type Mutable<T> = {
  -readonly [K in keyof T]: Mutable<T[K]>;
};

type Split<
  S extends string,
  Splitter extends string = "/"
> = S extends `${infer U}${Splitter}${infer U2}`
  ? [U, ...Split<U2>]
  : S extends `${infer U}`
  ? [U]
  : [];
type GetByKey<
  S extends { [key: string]: any },
  K extends any
> = K extends keyof S ? S[K] : never;

type Get<O extends { [key: string]: any }, P extends string[]> = P extends [
  infer U
]
  ? GetByKey<O, U>
  : P extends [infer U, ...infer U2]
  ? U2 extends string[]
    ? Get<GetByKey<O, U>, U2>
    : never
  : never;

type InferNumberSchema<T, E = unknown> = T extends {
  type: "number" | "float" | "integer" | "double";
}
  ? number
  : E;
type InferStringSchema<T, E = unknown> = T extends { type: "string" }
  ? string
  : E;
type InferObjectPropertiesSchemaType<
  T,
  Base extends {},
  E = unknown
> = T extends {
  [key: string]: any;
}
  ? { [K in keyof T]: InferJSONSchemaType<T[K], Base, E> }
  : E;

type InferAdditionalPropertiesSchema<
  T extends {} | boolean,
  Base extends {},
  E = unknown
> = T extends boolean
  ? T extends true
    ? { [key: string]: any }
    : {}
  : T extends { type: string }
  ? { [key: string]: InferJSONSchemaType<T, Base> }
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
type InferObjectSchemasAllOf<T extends any[], Base extends {}> = T extends [
  infer U,
  ...infer U2
]
  ? InferObjectPropertiesSchema<U, Base> &
      (U2 extends []
        ? InferObjectPropertiesSchema<U, Base>
        : InferObjectSchemasAllOf<U2, Base>)
  : unknown;
type InferObjectSchemasOneOf<T extends any[], Base extends {}> = T extends [
  infer U,
  ...infer U2
]
  ?
      | InferObjectPropertiesSchema<U, Base>
      | (U2 extends []
          ? InferObjectPropertiesSchema<U, Base>
          : InferObjectSchemasOneOf<U2, Base>)
  : unknown;
type InferObjectSchemasAnyOf<T extends any[], Base extends {}> = T extends [
  infer U,
  ...infer U2
]
  ?
      | InferObjectPropertiesSchema<U, Base>
      | (U2 extends []
          ? InferObjectPropertiesSchema<U, Base>
          : InferObjectSchemasAnyOf<U2, Base>)
  : unknown;

type InferObjectPropertiesSchema<T, Base extends {}, E = unknown> = T extends {
  properties?: infer P;
  additionalProperties?: infer AP;
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

type InferObjectSchema<T, Base extends {}, E = unknown> = T extends {
  type: "object";
  properties?: infer P;
  additionalProperties?: infer AP;
  allOf?: any[];
  anyOf?: any[];
  oneOf?: any[];
}
  ? (InferObjectPropertiesSchema<T, Base> &
      InferAdditionalPropertiesSchema<AP, Base, E>) &
      (T extends { allOf: any[] }
        ? InferObjectSchemasAllOf<T["allOf"], Base>
        : {}) &
      (T extends { anyOf: any[] }
        ? InferObjectSchemasAnyOf<T["anyOf"], Base>
        : {}) &
      (T extends { oneOf: any[] }
        ? InferObjectSchemasOneOf<T["oneOf"], Base>
        : {})
  : E;
type InferReferenceSchema<T, Base extends {}, E = unknown> = T extends {
  $ref: infer R;
}
  ? R extends `#/${infer U}`
    ? InferJSONSchemaType<Get<Base, Split<U>>, Base, E>
    : E
  : E;

type InferTupleSchema<T extends any[], Base extends {}> = T extends [
  infer U,
  ...infer U2
]
  ? [InferJSONSchemaType<U, Base>, ...InferTupleSchema<U2, Base>]
  : [];
type InferArraySchema<T, Base extends {}, E = unknown> = T extends {
  type: "array";
}
  ? T extends { items: infer I }
    ? I extends { $ref: string }
      ? InferJSONSchemaType<I, Base>[]
      : I extends { type: string }
      ? InferJSONSchemaType<I, Base>[]
      : I extends [...any]
      ? InferTupleSchema<I, Base>
      : E
    : E
  : E;
type InferNullable<T, V> = T extends { nullable: true } ? null | V : V;

type InferJSONSchemaType<
  T extends any,
  B extends {},
  E = unknown
> = InferNullable<
  T,
  InferReferenceSchema<
    T,
    B,
    InferStringSchema<
      T,
      InferNumberSchema<T, InferObjectSchema<T, B, InferArraySchema<T, B, E>>>
    >
  >
>;

export type InferJSONSchema<T extends any> = InferJSONSchemaType<
  Mutable<T>,
  Mutable<T>
>;
