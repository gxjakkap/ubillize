export function isEmpty(obj: unknown) {
    return Object.keys(obj as never).length === 0
}