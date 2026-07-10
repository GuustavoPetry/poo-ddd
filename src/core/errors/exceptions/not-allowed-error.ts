import { ServiceError } from "../service-error";

export class NotAllowedError extends Error implements ServiceError {
    constructor() {
        super(`Not Allowed.`)
    }
}