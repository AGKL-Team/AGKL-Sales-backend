import { Line } from '../models/line';

export interface LineRepository {
  findAllForBrand(brandId: number): Promise<Line[]>;
  findById(id: number): Promise<Line | null>;

  save(line: Line): Promise<Line>;
  update(line: Line): Promise<Line>;
  delete(id: number): Promise<void>;
}
