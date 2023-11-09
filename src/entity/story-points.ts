import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StoryPoints {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;
}