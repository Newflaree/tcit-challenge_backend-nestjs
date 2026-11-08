import { Post } from '../entities/post.entity';

export interface IPostRepository {
  findAll(): Promise<Post[]>;
  findOne(id: number): Promise<Post | null>;
  create(data: { name: string; description: string }): Post;
  save(post: Post): Promise<Post>;
  remove(post: Post): Promise<Post>;
}
