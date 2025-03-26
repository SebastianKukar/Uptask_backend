import type { Request, Response, NextFunction } from "express";
export declare const handleInputErrors: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const handleInputValidation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
