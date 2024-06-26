import { InternalAppCode } from "./static-app-info";

interface FetchErrorProps {
    errorMessage: string;
    internalAppCode: InternalAppCode;
}

export default class FetchError extends Error {
    internalAppCode: InternalAppCode;

    constructor(errorDetails: FetchErrorProps) {
        super(errorDetails.errorMessage);
        this.internalAppCode = errorDetails.internalAppCode;
    }

}