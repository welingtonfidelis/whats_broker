interface tokenClientInterface {
    userId: string;
    clientId: string;
    userRole: string;
    iat: number;
    exp: number;
}

export { tokenClientInterface };
