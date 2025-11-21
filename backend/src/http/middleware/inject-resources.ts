import { Request, Response, NextFunction } from 'express';
import { ApplicationResources } from '../app';

export function injectDependencies(resources: ApplicationResources) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals.resources = resources;
    next();
  };
}