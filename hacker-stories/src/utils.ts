type Sortable = string | number;

export function sortByKey<T extends Record<string, Sortable>>(
    arr: T[],
    key: keyof T,
    ascending: boolean = true
): T[] {
    return [...arr].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        if (typeof valA === "number" && typeof valB === "number") {
            return ascending ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return ascending ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
}