import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity('articles')
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ type: 'text' })
    date!: string

  @Column({ type: 'integer', nullable: true })
    rate?: number

  @Column({ type: 'text' })
    text!: string
}
