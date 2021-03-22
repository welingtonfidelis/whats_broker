import {
  Entity, PrimaryGeneratedColumn, Column, Index,
} from 'typeorm';

@Entity('clients')
class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index({ unique: true })
    name: string;

    @Column()
    @Index({ unique: true })
    email: string;

    @Column()
    @Index({ unique: true })
    number: string;

    @Column({ name: 'end_point' })
    @Index({ unique: true })
    endPoint: string;

    @Column({ name: 'bot_key' })
    @Index({ unique: true })
    botKey: string;

    @Column()
    active: boolean;

    constructor(
      id: string, name: string, email: string, number: string,
      endPoint: string, botKey: string, active: boolean,
    ) {
      this.id = id;
      this.name = name;
      this.number = number;
      this.email = email;
      this.endPoint = endPoint;
      this.botKey = botKey;
      this.active = active;
    }
}

export { Client };
