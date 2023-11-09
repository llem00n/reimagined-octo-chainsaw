import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  
  @Column()
  text: string;

  @Column()
  date: Date;

  @Column()
  unlocked: boolean;

  @Column()
  type: string;

  @Column()
  image: string;
}