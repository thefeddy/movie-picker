import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    Unique,
    Index,
    BeforeInsert,
} from 'typeorm';

// import * as bcrypt from 'bcrypt';

import { UsersRO } from './users.ro';
import { isDate } from 'moment';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'email',
        type: 'varchar',
    })
    email: string;

    @Column({
        name: 'password',
        type: 'varchar',
        select: false
    })
    password: string;

    @Column({ default: new Date() })
    joined: Date;

    @BeforeInsert()
    setCreatedDate(): void {
        this.joined = new Date();
    }

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        //this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(password: string): Promise<boolean> {
        return;
        // return await bcrypt.compare(password, this.password);
    }


    toResponseObject(): UsersRO {
        const { id, email, password, joined } = this;

        const responseObject: UsersRO = {
            id,
            email,
            password,
            joined
        };

        return responseObject;
    }
}
