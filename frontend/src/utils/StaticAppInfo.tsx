export const userDetailsParams = {
    name: 'name',
    surname: 'surname',
    email: 'email',
    city: 'city',
    cityCode: 'cityCode',
    street: 'street',
    houseNumber: 'houseNumber',
    phoneNumber: 'phoneNumber',
    dateOfBirth: 'dateOfBirth',
}


export enum InternalAppCode {
    BAD_ACCESS_TOKEN = 'BAD_ACCESS_TOKEN',
    ACCESS_TOKEN_EXPIRED = 'ACCESS_TOKEN_EXPIRED',
    BAD_REFRESH_TOKEN = 'BAD_REFRESH_TOKEN',
    REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
    NO_USER_PERMS = 'NO_USER_PERMS',
    NO_ADMIN_PERMS = 'NO_ADMIN_PERMS',
    BAD_CREDENTIALS = 'BAD_CREDENTIALS',
}
