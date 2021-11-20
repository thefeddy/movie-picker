import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    Unique,
    Index,
} from 'typeorm';

import { UsersRO } from './users.ro';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'name',
        type: 'varchar',
        nullable: true,
        length: 255
    })
    name: string;

    @Column({
        name: 'discord_id',
        type: 'varchar',
        nullable: true,
        length: 255
    })
    discord_id: string;

    @Column({
        name: 'communities',
        type: 'varchar',
        nullable: true,
        length: 255
    })
    communities: string;

    toResponseObject(): UsersRO {
        const { id, name, discord_id, communities } = this;

        const responseObject: UsersRO = {
            id,
            name,
            discord_id,
            communities
        };

        return responseObject;
    }
}
