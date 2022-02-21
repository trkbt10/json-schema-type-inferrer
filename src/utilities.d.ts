export type Unpacked<T> = T extends (infer U)[] ? U : T;

export type Mutable<T> = {
  -readonly [K in keyof T]: Mutable<T[K]>;
};

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
