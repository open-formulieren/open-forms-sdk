/**
 * Checks whether a value exists at the given path inside an object.
 *
 * Unlike a simple truthiness check, this function only verifies that the
 * property exists. A property with a value of `null`, `false`, `0`, or an
 * empty string is considered present.
 *
 * Supports nested paths separated by dots.
 *
 * @param obj - The object to search in.
 * @param path - The dot-separated property path to check (e.g. `"textField.foo"`).
 * @returns `true` if the complete path exists in the object, otherwise `false`.
 */
export function isInPath(obj: unknown, path: string): boolean {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object' ||
      !Object.prototype.hasOwnProperty.call(current, part)
    ) {
      return false;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return true;
}
