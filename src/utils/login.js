import config from "@/config/myConfig";

export function isAuthenticated() {
    return !localStorage.getItem(config.tokenName) === ''
}