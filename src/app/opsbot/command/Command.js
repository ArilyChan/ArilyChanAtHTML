"use strict";

// const CommandsInfo = require("./CommandsInfo");
const Arg = require("./Arg");

const getBeatmapData = require("../api/getBeatmapData");
const getBestScoresData = require("../api/getBestScoresData");
const getRecentScoresData = require("../api/getRecentScoresData");
const getScoreData = require("../api/getScoreData");
const getUserData = require("../api/getUserData");

/**
 * 消息
 * @namespace Command
 * @property {Object} meta
 * @property {String} msg
 */
class Command {
    /**
     * @param {String} message 消息
     */
    constructor(message) {
        this.host = "osu.ppy.sb";
        this.msg = message.trim().replace(/&#(x)?(\w+);/g, function ($, $1, $2) {
            return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
        });
        this.commandString = "";
        this.argString = "";
    }

    /**
     * 检查消息前缀，暂只支持单个字母作为前缀
     * @returns {Boolean} 消息是否符合前缀
     */
    cutPrefix() {
        const msgPrefix = this.msg.substring(0, 1);
        if (msgPrefix !== "*") return false;
        else {
            this.msg = this.msg.substring(1).trim();
            return true;
        }
    }

    /**
     * 拆出指令和参数，使用前需要先cutPrefix
     * @param {RegExp} commandReg 
     * @returns {Boolean} 消息是否符合指令形式
     */
    cutCommand(commandReg) {
        const mr = commandReg.exec(this.msg);
        if (mr === null) return false;
        else {
            this.commandString = mr[1].toLowerCase();
            this.argString = this.msg.substring(this.commandString.length).trim();
            return true;
        }
    }

    getNoArgErrorMessage(argName, argNecessity) {
        let errorMessage = "参数错误：";
        argName = argName.toLowerCase();
        if (argName.indexOf("userstringwithbeatmap") >= 0 || argName.indexOf("userstringwithoutbeatmap") >= 0) errorMessage = errorMessage + "缺少必要参数：玩家名";
        else if (argName.indexOf("beatmapstringwithuser") >= 0 || argName.indexOf("beatmapstringwithoutuser") >= 0) errorMessage = errorMessage + "缺少必要参数：谱面";
        else if (argName.indexOf("mode") >= 0) errorMessage = errorMessage + "缺少必要参数：模式";
        else if (argName.indexOf("limit") >= 0) errorMessage = errorMessage + "缺少必要参数：索引";
        return errorMessage;
    }

    /**
     * 分析argString
     * @param {Object} commandInfo 
     * @param {Object} regs 
     * @returns {Promise<Arg>}
     */
    async getArgObject(commandInfo, regs) {
        let args = {};
        /**@type {Array<String>} */
        let argsName = commandInfo.args;
        /**@type {Array<2|-1>}  2：必须直接提供 -1：可省略 */
        let argNecessity = commandInfo.argNecessity;
        argsName.map((argName, index) => {
            let ar = regs[argName].exec(this.argString);
            if (ar === null) {
                // 没匹配到该参数
                if (argNecessity[index] === 2) throw this.getNoArgErrorMessage(argsName[index], 2);
            }
            else {
                args[argName] = ar[1];
            }
        });
        return new Arg(args);
    }


    getHelp(prefix, commands) {
        let output = ""
        if (!this.argString) {
            output = output + "osu.ppy.sb 专用查询\n";
            output = output + prefix + "stat/statrx 查状态\n";
            output = output + prefix + "bp/bprx 查bp\n";
            output = output + prefix + "nbp/nbprx 查谱面在bp位置\n";
            output = output + prefix + "todaybp/todaybprx 查今日bp\n";
            output = output + prefix + "pr/prrx 查最近pass成绩\n";
            output = output + prefix + "recent/recentrx 查最近成绩（包括未完成）\n";
            output = output + prefix + "score 查成绩（仅限classic）\n";
            output = output + prefix + "top/vstop 查#1成绩（仅限classic）\n";
            output = output + "\n";
            output = output + prefix + "score查成绩时谱面名和玩家名之间要用|分隔\n";
            output = output + prefix + "score查成绩时玩家名用/分割可以同时查询多玩家的成绩\n";
            output = output + prefix + "help + 指令 可以查询该指令详细信息\n";
            // output = output + "基本指令有：" + commands.reduce((acc, cur) => { return acc + cur.command[0] + "/" }, "");
            return output;
        }
        // 查找指令
        for (let com of commands) {
            if (com.command.includes(this.argString)) {
                output = output + com.info + "\n";
                output = output + "指令：" + com.command.join("/") + "\n";
                output = output + "参数：" + com.argsInfo;
                return output;
            }
        }
        return "没有 " + this.argString + " 这个指令呢";
    }

    /**
     * 运行指令
     * @param {CommandsInfo} commandsInfo 
     */
    async execute(commandsInfo) {
        try {
            if (!this.cutPrefix(commandsInfo.prefix, commandsInfo.prefix2)) return ""; // 非指定前缀
            if (!this.cutCommand(commandsInfo.commandReg)) return ""; // 指令格式不正确
            // 帮助
            if (this.commandString === "help") {
                return this.getHelp(commandsInfo.prefix, commandsInfo.commands);
            }
            // 查找指令
            // score api暂不能获取rx模式成绩！！
            const commands = commandsInfo.commands;
            for (let com of commands) {
                if (com.command.includes(this.commandString)) {
                    let arg = await this.getArgObject(com, commandsInfo.regs);
                    let type = com.type;
                    switch (type) {
                        case 'api_beatmap': return await this.getApiBeatmapInfo(arg);
                        case 'api_user': return await this.getApiUserInfo(arg, false);
                        case 'api_user_rx': return await this.getApiUserInfo(arg, true);
                        case 'api_score': return await this.getApiScoreInfo(arg, false, false, false, false);
                        // case 'api_score_rx': return await this.getApiScoreInfo(arg, true, false, false, false);
                        case 'api_score_top': return await this.getApiScoreInfo(arg, false, true, false, false);
                        // case 'api_score_top_rx': return await this.getApiScoreInfo(arg, true, true, false, false);
                        case 'api_score_tops': return await this.getApiScoreInfo(arg, false, false, false, true);
                        case 'api_score_vstop': return await this.getApiScoreInfo(arg, false, false, true, false);
                        // case 'api_score_vstop_rx': return await this.getApiScoreInfo(arg, true, false, true, false);
                        case 'api_bp': return this.getApiBpInfo(arg, false);
                        case 'api_bp_rx': return this.getApiBpInfo(arg, true);
                        case 'api_ranknumber': return this.getApiRankNumber(arg, false);
                        case 'api_ranknumber_rx': return this.getApiRankNumber(arg, true);
                        case 'api_todaybp': return this.getApiTodayBpInfo(arg, false);
                        case 'api_todaybp_rx': return this.getApiTodayBpInfo(arg, true);
                        case 'api_recent': return this.getApiRecentInfo(arg, false, false);
                        case 'api_recent_rx': return this.getApiRecentInfo(arg, true, false);
                        case 'api_recent_passed': return this.getApiRecentInfo(arg, false, true);
                        case 'api_recent_passed_rx': return this.getApiRecentInfo(arg, true, true);
                        default: return "当你看到这条信息说明指令处理代码有bug惹";
                    }
                }
            }
            return ""; // 找不到该指令
        }
        catch (ex) {
            return ex;
        }
    }

    async getApiBeatmapInfo(arg) {
        try {
            let arg2 = await arg.getBeatmapId();
            let apiObjects = arg2.getOsuApiObject();
            return await new getBeatmapData(this.host, apiObjects).output();
        }
        catch (ex) {
            return ex;
        }
    }

    async getApiUserInfo(arg, isRX) {
        let apiObjects = arg.getOsuApiObject();
        return await new getUserData(this.host, apiObjects, isRX).output();
    }

    async getApiScoreInfo(arg, isRX, isTop, isVsTop, isTops) {
        try {
            let arg2 = await arg.getBeatmapId();
            let apiObjects = arg2.getOsuApiObject();
            return await new getScoreData(this.host, apiObjects, isRX, isTop, isVsTop, isTops).output();
        }
        catch (ex) {
            return ex;
        }
    }

    async getApiBpInfo(arg, isRX) {
        let apiObjects = arg.getOsuApiObject();
        return await new getBestScoresData(this.host, apiObjects, isRX).output();
    }

    async getApiRankNumber(arg, isRX) {
        let apiObjects = arg.getOsuApiObject();
        return await new getBestScoresData(this.host, apiObjects, isRX).outputRankNumber();
    }

    async getApiTodayBpInfo(arg, isRX) {
        let apiObjects = arg.getOsuApiObject();
        return await new getBestScoresData(this.host, apiObjects, isRX).outputToday();
    }

    async getApiBpNumberInfo(arg, isRX) {
        try {
            let arg2 = await arg.getBeatmapId();
            let apiObjects = arg2.getOsuApiObject();
            return await new getBestScoresData(this.host, apiObjects, isRX, arg.beatmapSearchString).outputBpNumber();
        }
        catch (ex) {
            return ex;
        }
    }

    async getApiRecentInfo(arg, isRX, isPassed) {
        let apiObjects = arg.getOsuApiObject();
        return await new getRecentScoresData(this.host, apiObjects, isRX, isPassed).output();
    }
}

module.exports = Command;