const state: { patched?: true } = {};

export const getNginxUnitPatched = () => state.patched;

export const setNginxUnitPatched = () => state.patched = true;

export default getNginxUnitPatched;