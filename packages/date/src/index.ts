export const shortDateString = (date: number) => {
    const epdate = new Date(date)
    return epdate.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short"
    })
}

export const formatDateString = (date: number) => {
    const epdate = new Date(date)
    return epdate.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}