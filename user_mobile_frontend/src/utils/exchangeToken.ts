import { InternalAppCode } from "./StaticAppInfo";
import { ApiUrls } from "./urls";

const exchangeToken = async (refreshToken: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const payload = JSON.stringify({ token: refreshToken });

        const timeoutId = setTimeout(() => {
            reject({ errorMessage: 'Request timed out', internalAppCode: InternalAppCode.REQUEST_TIMED_OUT });
        }, 5000);

        try {
            const response = await fetch(ApiUrls.POST_REFRESH_TOKEN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: payload,
            });

            clearTimeout(timeoutId);

            const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');

            if (!response.ok) {
                const body = containsJson ? await response.json() : null;

                const errorMessage = containsJson
                    ? body.message || body
                    : response.status;

                const internalAppCode = containsJson
                    ? body.internalAppCode
                    : null;

                reject({ errorMessage, internalAppCode });
            }

            if (!containsJson) {
                reject({ errorMessage: 'Status OK, but no required JSON', internalAppCode: InternalAppCode.BAD_JSON_RESPONSE });
            } else {
                const responseData = await response.json();

                if (!responseData.hasOwnProperty('token') || !responseData.hasOwnProperty('refreshToken')) {
                    reject({ errorMessage: 'Status OK with JSON, but no required JSON keys', internalAppCode: InternalAppCode.BAD_JSON_RESPONSE });
                } else {
                    const newToken = responseData.token;
                    console.log(`new token arrived: \n${newToken}`)
                    resolve(newToken);
                }
            }
        } catch (error) {
            clearTimeout(timeoutId);
            reject({ errorMessage: `Undefined Error in catch block: ${error}`, internalAppCode: InternalAppCode.UNDEFINED_ERROR });
        }
    });
};

export default exchangeToken;