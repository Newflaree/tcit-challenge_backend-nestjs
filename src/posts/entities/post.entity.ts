import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidad persistida en la tabla `posts`.
 *
 * La entidad representa la fila de la base de datos; el contrato público se
 * deriva mediante `toPostResponse` (ver `dto/post-response.dto.ts`) para no
 * acoplar la API a la estructura interna de TypeORM.
 */
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  description: string;
}
