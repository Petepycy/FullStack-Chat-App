import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('message')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    message: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    fileName: string;

    @Column({ nullable: true })
    fileType: string;
}