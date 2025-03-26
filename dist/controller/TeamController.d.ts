import type { Request, Response } from 'express';
export declare class TeamMemberController {
    static findMemberByEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static getProjectTeam: (req: Request, res: Response) => Promise<void>;
    static addUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    static removeUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
