import { Category } from '../models/category';

export interface CategoryRepository {
  /**
   * Finds a category by its ID.
   * @param id - category id
   */
  findById(id: number): Promise<Category>;

  /**
   * Finds all categories.
   */
  findAll(): Promise<Category[]>;

  /**
   * Creates a new category.
   * @param category - category to create
   * @param userId - id of the user creating the category
   */
  create(category: Category, userId: string): Promise<Category>;

  /**
   * Updates an existing category.
   * @param category - category data to update
   * @param userId - id of the user performing the update
   */
  update(category: Category, userId: string): Promise<Category>;

  /**
   * Deletes a category by its ID.
   * @param id - category id
   * @param userId - id of the user performing the deletion
   */
  delete(id: number, userId: string): Promise<void>;

  /**
   * Checks if a category with the given name already exists.
   * @param name - category name
   */
  alreadyExists(name: string): Promise<boolean>;
}
