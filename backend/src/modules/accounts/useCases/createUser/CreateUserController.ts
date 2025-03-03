import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase } from './CreateUseUseCase';

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, password, email } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({ name, password, email });

    return response.status(201).json(user);
  }
}

export { CreateUserController }