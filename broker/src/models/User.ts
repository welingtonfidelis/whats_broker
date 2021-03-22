import {
  Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn,
} from 'typeorm';
import { Client } from './Client';

enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  AGENT = 'agent',
}

@Entity('users')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    @Index({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
      type: 'enum',
      enum: Role,
      default: Role.AGENT,
    })
    role: Role;

    @Column()
    active: boolean;

    @Column({ name: 'client_id' })
    clientId: string;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
    group: Client

    constructor(
      id: string, name: string, email: string, password: string,
      role: Role, active: boolean, clientId: string,
    ) {
      this.id = id;
      this.name = name;
      this.password = password;
      this.password = password;
      this.role = role;
      this.active = active;
      this.clientId = clientId;
    }
}

export { User };
