/**
 * this TypeDef simply supports a manual patch mode for NGINX Unit integration,
 * which is (expected to be) a rare use case; if you're new to somnus, please
 * focus on the file `somnus.ts` instead!
 */

declare const isNginxUnitPatched: true | undefined;
export default isNginxUnitPatched;
