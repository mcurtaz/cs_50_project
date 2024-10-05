export enum BookStatus {
    TO_READ = "To read",
    READING = "Reading",
    COMPLETED = "Completed",
    ABANDONED = "Abandoned",
    ON_HOLD = "On hold"
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