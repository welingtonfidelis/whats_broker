declare namespace Express {
    export interface Request {
      userId: string;
      clientId: string;
      clientBot: string;
      userRole: string;
    }
  }
