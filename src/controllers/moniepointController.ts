import { Request, Response } from 'express';

export const transactions = (req: Request, res: Response): void => {
  // business logic go sitdown here wella
  // consume your moniepoint endpoint
// chatgpt to the rescue



  res.status(200).json({
    message: 'December na 82days',
    status: 'success',
  });
};
