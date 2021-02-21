export function serialiseLogItems(items: Array<any>): string {
    return items.reduce((output: string, next: any) => {
        let value: string = "";
        if (["number", "boolean", "string"].indexOf(typeof next)) {
            value = `${next}`;
        } else if (next instanceof Date) {
            value = next.toISOString();
        } else if (typeof next === "undefined" || value === null) {
            // Do nothing
        } else {
            value = JSON.stringify(next);
        }
        return `${output} ${value}`;
    }, "").trim();
}
