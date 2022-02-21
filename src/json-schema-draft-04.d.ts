import { Unpacked, Get, Split, Mutable } from "./utilities";

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
  E = never
> = T extends {
  [key: string]: any;
}
  ? { [K in keyof T]: InferJSONSchemaType<T[K], Base> }
  : E;

export type InferAdditionalPropertiesSchema<
  T extends {} | boolean,
  Base extends {},
  E = never
> = T extends boolean
  ? T extends true
    ? { [key: string]: any }
    : {}
  : { [key: string]: InferJSONSchemaType<T, Base> };

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

export type InferObjectSchema<T, Base extends {}, E = never> = T extends {
  type: "object";
  properties?: infer P;
  additionalProperties?: infer AP;
}
  ?
      | InferObjectPropertiesSchema<T, Base>
      | InferAdditionalPropertiesSchema<AP, Base, E>
  : E;
export type InferReferenceSchema<T, Base extends {}, E = never> = T extends {
  $ref: infer R;
}
  ? R extends "#"
    ? InferJSONSchemaType<Base, Base>
    : R extends `#/${infer U}`
    ? InferJSONSchemaType<Get<Base, Split<U>>, Base>
    : E
  : E;

export type InferTupleItemSchema<T extends any[], Base extends {}> = T extends [
  infer U,
  ...infer U2
]
  ? [InferJSONSchemaType<U, Base>, ...InferTupleItemSchema<U2, Base>]
  : [];
export type InferArraySchema<T, Base extends {}, E = never> = T extends {
  type: "array";
}
  ? T extends { items: infer I }
    ? I extends {}
      ? InferJSONSchemaType<I, Base>[]
      : I extends [...any]
      ? InferTupleItemSchema<I, Base>
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
  Base extends {}
> = InferJSONSchemaType<ConcatTypes<T>, Base>;
export type MapForAnyOfProperties<
  T extends any[],
  Base extends {}
> = T extends [infer U, ...infer U2]
  ? InferJSONSchemaType<U, Base> | MapForAnyOfProperties<U2, Base>
  : never;
export type MapForOneOfProperties<
  T extends any[],
  Base extends {}
> = T extends [infer U, ...infer U2]
  ? InferJSONSchemaType<U, Base> | MapForOneOfProperties<U2, Base>
  : never;

export type InferForValidationSchema<T extends {}, Base extends {}> =
  | (T extends {
      allOf: any[];
    }
      ? MapForAllOfProperties<T["allOf"], Base>
      : never)
  | (T extends {
      anyOf: any[];
    }
      ? MapForAnyOfProperties<T["anyOf"], Base>
      : never)
  | (T extends {
      oneOf: any[];
    }
      ? MapForOneOfProperties<T["oneOf"], Base>
      : never);

export type InferDefaultValue<T, V> = T extends { default: infer D }
  ? V | D
  : V;
export type InferJSONSchemaType<T, B extends {}> = InferDefaultValue<
  T,
  InferNullable<
    T,
    | InferForValidationSchema<T, B>
    | InferPrimitiveJSONSchemaType<T>
    | InferObjectSchema<T, B>
    | InferArraySchema<T, B>
    | InferReferenceSchema<T, B>
  >
>;
type InferJSONSchema<T extends any> = InferJSONSchemaType<
  Mutable<T>,
  Mutable<T>
>;

export type InferJSONSchemaDraft04<T> = T extends {} ? InferJSONSchema<T> : {};

export type InferJSONSchemaVersionDraft04<T, E> = T extends {
  $schema: `${infer P}://json-schema.org/draft-04/schema${infer P}`;
}
  ? InferJSONSchemaType<Mutable<T>, Mutable<T>>
  : E;
