import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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

  @CreateDateColumn()
  @Column("timestamp")
  createdAt: Date;

  @UpdateDateColumn()
  @Column("timestamp")
  updatedAt: Date;
}
