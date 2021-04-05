import nested from "nested-property";

export function getThemeProp(props: Object, prop: string): string {
    const fullPath = `theme.${prop}`;
    const value = nested.get(props, fullPath);
    return typeof value !== "string" ? "" : value;
}
