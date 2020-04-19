
export const PASSWORD_RESET_REASON = "reset_password";
export const INVITE_USER_REASON = "invite_user";

export const DEFAULT_AVATAR_IMAGE = '../images/userAvatar/defaultAvatar.png';
export const DEFAULT_WORKSPACE_LOGO = '../images/workspacesLogos/workspacesDefault.png';

// MESSAGES
export const JWT_SECRET_KEY = 'supersecret';
export const MISSING_USER_ID = 'Missing user\'s id';
export const WORKSPACE_DOES_NOT_EXIST = id => `workspace with id ${id} doesn't exists`;
export const PERMISSION_DENIED = 'Permission Denied';
export const VALIDATION_ERROR = 'couldn\'t pass validation';
export const NOT_EXISTS = resource => `${resource} doesn't exist!`;
export const ALREADY_EXISTS = resource => `${resource} already exists`;
export const SOMETHING_WENT_WRONG = 'something went wrong';
export const INCORRECT_PASSWORD = 'Incorrect password';
export const INVALID_TOKEN = 'Invalid token';
export const EXPIRED_TOKEN = 'Token is expired, please try again';
export const PASSWORD_UPDATED = 'password successfully updated';
export const USER_SUCCESSFULLY_ADD = 'user successfully added to the workspace';
export const COULDNT_DELETE_WORKSPACE = 'couldn\'t delete a workspace';
export const COULDNT_ADD_USER_TO_THE_WORKSPACE = 'couldn\'t add a user to the workspace';


export const USER_TOKEN_REASONS = [
    PASSWORD_RESET_REASON,
    INVITE_USER_REASON
];


export const WORKSPACE_USERS_ROLES = {
    OWNER: "owner",
    ADMIN: "admin",
    MEMBER: 'member',
};


export const WORKSPACE_OPERATION_PERMISSIONS = {
    GET: ['owner', 'admin', 'member'],
    UPDATE: ['owner', 'admin'],
    DELETE: ['owner', 'admin'],
    ADD_USER: ['owner', 'admin'],
};
