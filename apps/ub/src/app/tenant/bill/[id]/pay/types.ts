export enum SlipUploadActionError {
    InvalidSlip = 0,
    OSVRateLimited = 1,
    SlipUploadError = 2,
    UnknownError = 3,
    ForbiddenError = 4
}

export interface SlipUploadActionRes {
    status: number,
    err?: SlipUploadActionError,
}