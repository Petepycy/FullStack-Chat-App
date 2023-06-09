import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('image')
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    fileName: string;

    @Column({ nullable: true })
    fileType: string;
}
