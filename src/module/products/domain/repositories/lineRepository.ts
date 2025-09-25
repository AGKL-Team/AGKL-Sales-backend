import { Line } from '../models/line';

export interface LineRepository {
  findAllForBrand(brandId: number): Promise<Line[]>;
  findById(id: number): Promise<Line | null>;

  save(line: Line, userId: string): Promise<Line>;
  update(line: Line, userId: string): Promise<Line>;
  delete(id: number, userId: string): Promise<void>;
}
