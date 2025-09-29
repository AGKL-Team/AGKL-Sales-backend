import { Injectable } from '@nestjs/common';
import { LineService } from '../../infrastructure/services/line.service';

@Injectable()
export class UpdateLineUseCase {
  constructor(private readonly service: LineService) {}

  /**
   * Executes the use case to update a line.
   * @param lineId - The ID of the line to be updated.
   * @param name - The new name for the line.
   * @param userId - The ID of the user performing the update.
   * @returns The updated line.
   * @throws NotFoundException if the line does not exist.
   * @throws BadRequestException if the update fails due to invalid data.
   */
  public async execute(lineId: number, name: string, userId: string) {
    // 1. Ensure the line exists
    const line = await this.service.findById(lineId);

    // 2. Update the line with the new name
    line.changeName(name);

    // 3. Save the updated line
    return await this.service.update(line, userId);
  }
}
