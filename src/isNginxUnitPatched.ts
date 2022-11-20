/**
 * this module simply supports a manual patch mode for NGINX Unit integration,
 * which is (expected to be) a rare use case; if you're new to somnus, please
 * focus on the file `somnus.ts` instead!
 */

const state: { patched?: true } = {};

export const getNginxUnitPatched = () => state.patched;

export const setNginxUnitPatched = () => state.patched = true;

export default getNginxUnitPatched;
