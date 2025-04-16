import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 50 })
  email: string;

  @Column("text")
  password: string;

  @Column("text")
  nickname: string;

  @Column("text")
  image: string;

  @Column("datetime")
  createdAt: Date;

  @Column("datetime")
  updatedAt: Date;
}
