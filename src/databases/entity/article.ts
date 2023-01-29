import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('articles')
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number

  @Column({ type: 'text' })
    date!: string

  @Column({ type: 'integer', nullable: true })
    rate?: number

  @Column({ type: 'text' })
    text!: string

  @CreateDateColumn({ name: 'created_at', type: 'text', precision: 0 })
  readonly createdAt!: string

  @UpdateDateColumn({ name: 'updated_at', type: 'text', precision: 0 })
  readonly updatedAt!: string
}
