declare module 'zwsp-steg' {
    export function decode(data, mode): string;
    export function encode(data, mode): string;
    export function MODE_FULL(): string;
  }