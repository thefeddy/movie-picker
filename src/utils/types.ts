import { User } from "discord.js";


export type UserDetails = {
    username: string;
    discriminator: string;
    discordId: string;
    avatar: string;
    accessToken: string;
    refreshToken: string;
};

export type Done = (err: Error, user: User) => void;