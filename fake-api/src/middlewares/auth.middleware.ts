import { NextFunction, Request, Response } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const expectedToken = process.env.API_TOKEN || 'qa-lab-token';
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Token de autenticação não informado'
    });
  }

  if (authorization !== `Bearer ${expectedToken}`) {
    return res.status(403).json({
      code: 'FORBIDDEN',
      message: 'Token de autenticação inválido'
    });
  }

  return next();
}
