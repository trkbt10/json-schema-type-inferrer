import type { Join, DropLastIndex, Split, Basename, Get } from "./utilities";

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
