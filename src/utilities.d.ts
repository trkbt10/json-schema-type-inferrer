export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type Mutable<T> = {
  -readonly [K in keyof T]: Mutable<T[K]>;
};
export type IsIdentical<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;
export type Join<T extends any[], S extends string> = T extends [
  infer U,
  ...infer U2
]
  ? U extends string
    ? `${U}${S}${Join<U2, S>}`
    : ""
  : "";

export type Split<
  S extends string,
  Splitter extends string = "/"
> = S extends `${infer U}${Splitter}${infer U2}`
  ? [U, ...Split<U2>]
  : S extends `${infer U}`
  ? [U]
  : [];
export type GetByKey<
  S extends { [key: string]: any },
  K extends any
> = K extends keyof S ? S[K] : never;

export type Get<
  O extends { [key: string]: any },
  P extends string[]
> = P extends [infer U]
  ? GetByKey<O, U>
  : P extends [infer U, ...infer U2]
  ? U2 extends string[]
    ? Get<GetByKey<O, U>, U2>
    : never
  : never;

export type DropLastIndex<T extends string[]> = T extends [...infer U, infer V]
  ? U
  : never;

export type Basename<T> =
  T extends `${infer Protocol}//${infer LocationWithPaths}`
    ? `${Protocol}//${Split<LocationWithPaths, "/">[0]}`
    : never;
