enum BookStatus {
    TO_READ,
    READING,
    COMPLETED,
    ABANDONED,
    ON_HOLD
}

export type Book = {
    id: number,
    image_url: string | null,
    title: string,
    description: string,
    author: string,
    rating: number,
    status: BookStatus
}