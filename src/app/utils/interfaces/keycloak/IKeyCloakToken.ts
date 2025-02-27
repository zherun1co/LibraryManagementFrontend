export interface IKeyCloakToken {
    preferred_username?: string;
    email?: string;
    sub?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    realm_access?: { roles: string[] };
    resource_access?: { [key: string]: { roles: string[] } };
}