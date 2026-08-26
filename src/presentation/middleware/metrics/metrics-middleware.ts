import { Request, Response, NextFunction } from 'express';
import { httpRequestDuration } from '../../../infrastructure/logging/metrics';

const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode.toString(),
    });
  });

  next();
};

export default metricsMiddleware;
