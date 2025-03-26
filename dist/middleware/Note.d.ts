import type { Request, Response, NextFunction } from 'express';
export declare function taskExist(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function taskBelongToProject(req: Request, res: Response, next: NextFunction): void;
