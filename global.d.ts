declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "react/jsx-runtime" {
  export function jsx(type: any, props: any, key?: string | number): any;
  export function jsxs(type: any, props: any, key?: string | number): any;
  export function Fragment(props: { children?: any }): any;
}

declare module "framer-motion" {
  import * as React from "react";

  export const motion: any;
  export type Variants = any;
  export const AnimatePresence: any;
  export const useAnimation: any;
  export const motionValue: any;
  export const useMotionValue: any;
}
