"use strict";

const UserObject = require("./objects/UserObject");
const RippleApi = require("./RippleApiRequest");
const SimpleUserObject = require("./objects/SimpleUserObject");
const utils = require("./utils");

class getUserData {
    constructor(host, apiObjects, isRX) {
        this.host = host;
        this.apiObject = (Array.isArray(apiObjects)) ? apiObjects[0] : apiObjects; // 只允许同时查一个人
        this.isRX = isRX;
    }

    async getUserObject() {
        const rippleUser = (this.isRX) ? await RippleApi.getUsersFullRx(this.apiObject, this.host) : await RippleApi.getUsersFull(this.apiObject, this.host);
        if (rippleUser.code === 404) throw "找不到玩家 " + utils.apiObjectToString(this.apiObject);
        if (rippleUser.code === 400) throw "必须指定玩家名或Id";
        if (rippleUser.code === "error") throw "获取玩家出错 " + utils.apiObjectToString(this.apiObject);
        let userObject = new UserObject(rippleUser);
        return userObject;
    }

    async getSimpleUserObject() {
        const rippleUser = await RippleApi.getUsers(this.apiObject, this.host);
        if (rippleUser.code === 404) throw "找不到玩家 " + utils.apiObjectToString(this.apiObject);
        if (rippleUser.code === 400) throw "必须指定玩家名或Id";
        if (rippleUser.code === "error") throw "获取玩家出错 " + utils.apiObjectToString(this.apiObject);
        let userObject = new SimpleUserObject(rippleUser);
        return userObject;
    }

    async output() {
        try {
            let rippleUser = await this.getUserObject();
            if (typeof rippleUser === "string") return rippleUser; // 报错消息
            let mode = (this.apiObject.m) ? this.apiObject.m : undefined;
            return rippleUser.toString(mode, this.isRX);
        }
        catch (ex) {
            return ex;
        }
    }
}

module.exports = getUserData;