interface Iemail {
    email: string;
    name: string;
    token: string;
}
export declare class AuthEmail {
    static sendConfirmationEmail: (user: Iemail) => Promise<void>;
    static sendPasswordResetToken: (user: Iemail) => Promise<void>;
}
export {};
