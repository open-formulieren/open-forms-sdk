// See: https://stackoverflow.com/a/70398145
declare namespace React {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}
