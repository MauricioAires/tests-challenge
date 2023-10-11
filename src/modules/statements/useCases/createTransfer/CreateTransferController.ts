import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { amount, description } = request.body;
    const { user_id } = request.params;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const statement = await createTransfer.execute({
      user_id,
      amount,
      description,
      sender_id: id,
    });

    return response.status(201).json(statement);
  }
}
