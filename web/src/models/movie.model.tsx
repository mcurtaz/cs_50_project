export enum MovieStatus {
    TO_WATCH = "To watch",
    WATCHING = "Watching",
    COMPLETED = "Completed",
    ABANDONED = "Abandoned",
    ON_HOLD = "On hold"
}

export type Movie = {
    id: number,
    image_url: string | null,
    title: string,
    description: string,
    rating: number,
    status: MovieStatus
}