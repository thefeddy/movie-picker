export class MoviesDTO {
    readonly id: number;
    readonly title: string;
    readonly trailer_url: string;
    readonly streaming_service: string;
    readonly watched: number;
}

export class CreateMovieDTO {
    readonly title: string;
    readonly trailer_url: string;
    readonly streaming_service: string;
}

export class WatchedMovieDTO {
    readonly id: number;
    readonly watched: number;
}
