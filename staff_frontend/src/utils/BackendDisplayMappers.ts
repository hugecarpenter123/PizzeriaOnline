export const statusMapper: { [key: string]: { [key: string]: string } } = {
    "PENDING": { color: 'blue', label: "OCZEKUJĄCE" },
    "IN_PROGRESS": { color: 'orange', label: "W TRAKCIE" },
    "COMPLETED": { color: 'green', label: "ZAKOŃCZONE" },
    "CANCELLED": { color: 'red', label: "ANULOWANE" },
}

export const orderTypeMapper = {
    "DELIVERY": "Dostawa",
    "PICKUP": "Odbiór osobisty"
}

export const sizesMapper: { [key: string]: string } = {
    "SMALL": "Mała",
    "MEDIUM": "Średnia",
    "BIG": "Duża",
    "Small (330ml)": "330ml",
    "Medium (500ml)": "500ml",
    "Big (1000ml)": "1000ml",
}

export const dateTimeParser = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}