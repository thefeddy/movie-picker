import { Users } from "src/users/users.entity";
import { UserDetails } from "src/utils/types";


export interface AuthenticationProvider {
    validateUser(details: UserDetails);
    createUser(details: UserDetails);
    findUser(discordId: string): Promise<Users | undefined>;
}