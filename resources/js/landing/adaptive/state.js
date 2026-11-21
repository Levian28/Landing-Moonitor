/**
 * Manajemen runtime state terpusat untuk modul adaptif.
 */
let activeRuntime = null;

export const getRuntime = () => activeRuntime;
export const setRuntime = (rt) => {
    activeRuntime = rt;
};
