
export const PASSWORD_RESET_REASON = "reset_password";
export const INVITE_USER_REASON = "invite_user";

export const DEFAULT_AVATAR_IMAGE = '../images/userAvatar/defaultAvatar.png';
export const DEFAULT_WORKSPACE_LOGO = '../images/workspacesLogos/workspacesDefault.png';

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
};
