declare namespace NodeJS {
    interface ProcessEnv {
        // Define your environment variables here
        // For example:
        // DB_CONNECTION_STRING: string;
        // API_KEY: string;
        DATABASE_URL: string,
        LINE_CHANNEL_ACCESS_TOKEN: string,
        LINE_CHANNEL_ID: string,
        LINE_CHANNEL_SECRET: string,
        LINE_LOGIN_CALLBACK: string,
        AUTH_SECRET: string,
        AUTH_LINE_ID: string,
        AUTH_LINE_SECRET:string,
        AUTH_TRUST_HOST: boolean,
        AUTH_URL: string,
        OSV_TOKEN: string,
        S3_URL: string,
        S3_BUCKET: string,
        S3_ACCESS_KEY_ID: string,
        S3_SECRET_ACCESS_KEY: string,
        BASE_URL: string,
        NEXT_DEBUG: boolean,
        [key: string]: string | undefined;
    }
}