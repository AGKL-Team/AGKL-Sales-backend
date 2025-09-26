import { Line } from '../models/line';

export interface LineRepository {
  /**
   * Retrieves all lines associated with a specific brand.
   * @param brandId The ID of the brand whose lines are to be retrieved.
   */
  findAllForBrand(brandId: number): Promise<Line[]>;

  /**
   * Finds a line by its ID.
   * @param id The ID of the line to retrieve.
   */
  findById(id: number): Promise<Line>;

  /**
   * Saves a new line.
   * @param line The line to save.
   * @param userId The ID of the user performing the save.
   */
  save(line: Line, userId: string): Promise<Line>;

  /**
   * Updates a line.
   * @param line The line to update.
   * @param userId The ID of the user performing the update.
   */
  update(line: Line, userId: string): Promise<Line>;

  /**
   * Deletes a line by its ID.
   * @param id The ID of the line to delete.
   * @param userId The ID of the user performing the deletion.
   */
  delete(id: number, userId: string): Promise<void>;

  /**
   * Check if a line with the given name already exists for the specified brand.
   * @param name The name of the line.
   * @param brandId The ID of the brand.
   */
  alreadyExistsLineByBrand(name: string, brandId: number): Promise<boolean>;
}
