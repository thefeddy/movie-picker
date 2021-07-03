export class MoviesDTO {
    readonly id: number;
    readonly movie_id: string;
    readonly watched: number;
    readonly watched_on: Date;
    readonly added: Date;
    readonly watched_with: string;
}

export class CreateMovieDTO {
    readonly id: number;
    readonly movie_id: string;
    readonly watched: number;
    readonly watched_on: Date;
    readonly added: Date;
    readonly watched_with: string;
}

export class WatchedMovieDTO {
    readonly id: number;
    readonly movie_id: string;
    readonly watched: number;
    readonly watched_on: Date;
    readonly added: Date;
    readonly watched_with: string;
}
