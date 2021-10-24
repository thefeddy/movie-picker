export class MoviesDTO {
    readonly id: number;
    readonly movie_id: string;
    readonly watched: number;
}

export class CreateMovieDTO {
    readonly id: number;
    readonly movie_id: string;
    readonly watched: number;
}

export class WatchedMovieDTO {
    readonly id: number;
    readonly movie_id: string;
    readonly watched: number;
}
