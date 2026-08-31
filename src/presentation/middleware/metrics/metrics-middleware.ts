import { Request, Response, NextFunction } from 'express';

import {
  httpRequestDuration,
  httpRequestsTotal,
  httpErrorsTotal,
  activeRequests,
} from '../../../infrastructure/logging/metrics';

const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  activeRequests.inc();

  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    activeRequests.dec();

    const route = req.route?.path || req.path;
    const statusCode = res.statusCode.toString();

    // Request counter
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: statusCode,
    });

    // Error counter
    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({
        method: req.method,
        route,
        status_code: statusCode,
      });
    }

    // Request duration
    end({
      method: req.method,
      route,
      status_code: statusCode,
    });
  });

  next();
};

export default metricsMiddleware;
