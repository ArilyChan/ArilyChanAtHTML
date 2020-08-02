"use strict";


function CommandsInfo() {
    this.prefix = "*";
    this.commandReg = /^([a-zA-Z]+)/i // 去除prefix后截取指令部分
    this.regs = {
        beatmapStringWithUser: /^([^|｜]+)/i, // 后面有user时取beatmap
        beatmapStringWithoutUser: /^([^+＋:：#＃]+)/i, // 后面没有user时取beatmap
        userStringWithBeatmap: /[|｜]([^+＋:：#＃|｜]+)/i, // 前面有beatmap时取user
        userStringWithoutBeatmap: /^([^+＋:：#＃|｜]+)/i, // 前面没有beatmap时取user
        // modsString: /[+＋]([a-zA-Z0-9]+)/i,
        modeString: /[:：]([^+＋:：#＃|｜/／“”'"]+)/i,
        onlyModeString: /^([^+＋:：#＃|｜/／“”'"]+)/i, // 参数只有mode，设置mode用
        limitString: /[#＃]([0-9]+)/i
    };
    this.commands = [
        {
            type: 'api_beatmap',
            info: '谱面查询',
            command: ['beatmap', 'search', 'b', 'map'],
            // argsInfo: '[beatmap] (+mods) (:mode)',
            // args: ['beatmapStringWithoutUser', 'modsString', 'modeString'],
            // argNecessity: [2, -1, -1]    // 2：必须直接提供 -1：可省略
            argsInfo: '[beatmap] (:mode)',
            args: ['beatmapStringWithoutUser', 'modeString'],
            argNecessity: [2, -1] // 谱面查询一般不看默认mode
        }, {
            type: 'api_user',
            info: '玩家查询',
            command: ['stat', 'u', 'user', 'p', 'player'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1]
        }, {
            type: 'api_user_rx',
            info: '玩家查询（relax模式）',
            command: ['statrx', 'rxstat', 'urx', 'userrx', 'prx', 'playerrx'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1]
        }, {
            type: 'api_score',
            info: '指定玩家谱面成绩查询',
            command: ['s', 'score'],
            // argsInfo: '[beatmap] | [user] (+mods) (:mode)',
            // args: ['beatmapStringWithUser', 'userStringWithBeatmap', 'modsString', 'modeString'],
            // argNecessity: [2, 2, -1, 0]
            argsInfo: '[beatmap] | [user] (:mode)',
            args: ['beatmapStringWithUser', 'userStringWithBeatmap', 'modeString'],
            argNecessity: [2, 2, -1]
            //}, {
            //    type: 'api_score_rx',
            //    info: '指定玩家谱面成绩查询（relax模式）',
            //    command: ['srx', 'scorerx'],
            //    argsInfo: '[beatmap] | [user] (+mods) (:mode)',
            //    args: ['beatmapStringWithUser', 'userStringWithBeatmap', 'modsString', 'modeString'],
            //    argNecessity: [2, 2, -1, 0],
        }, {
            type: 'api_score_top',
            info: '谱面最高成绩查询',
            command: ['t', 'top'],
            // argsInfo: '[beatmap] (+mods) (:mode)',
            // args: ['beatmapStringWithoutUser', 'modsString', 'modeString'],
            // argNecessity: [2, -1, 0]
            argsInfo: '[beatmap] (:mode)',
            args: ['beatmapStringWithoutUser', 'modeString'],
            argNecessity: [2, -1]
        //}, {
            //    type: 'api_score_top_rx',
            //    info: '谱面最高成绩查询（relax模式）',
            //    command: ['trx', 'toprx'],
            //    argsInfo: '[beatmap] (+mods) (:mode)',
            //    args: ['beatmapStringWithoutUser', 'modsString', 'modeString'],
            //    argNecessity: [2, -1, 0],
        }, {
            type: 'api_score_tops',
            info: '谱面前10成绩查询',
            command: ['ts', 'tops'],
            // argsInfo: '[beatmap] (+mods) (:mode)',
            // args: ['beatmapStringWithoutUser', 'modsString', 'modeString'],
            // argNecessity: [2, -1, 0]
            argsInfo: '[beatmap] (:mode)',
            args: ['beatmapStringWithoutUser', 'modeString'],
            argNecessity: [2, -1]
        }, {
            type: 'api_score_vstop',
            info: '谱面成绩与最高成绩比较',
            command: ['vstop', 'topvs'],
            // argsInfo: '[beatmap] (+mods) (:mode)',
            // args: ['beatmapStringWithoutUser', 'modsString', 'modeString'],
            // argNecessity: [2, -1, 0]
            argsInfo: '[beatmap] (:mode)',
            args: ['beatmapStringWithoutUser', 'modeString'],
            argNecessity: [2, -1]
            //}, {
            //    type: 'api_score_vstop_rx',
            //    info: '谱面成绩与最高成绩比较（relax模式）',
            //    command: ['vstoprx', 'topvsrx'],
            //    argsInfo: '[beatmap] (+mods) (:mode)',
            //    args: ['beatmapStringWithoutUser', 'modsString', 'modeString'],
            //    argNecessity: [2, -1, 0],
        }, {
            type: 'api_bp',
            info: 'bp成绩查询（省略#number则输出bp5）',
            command: ['bp', 'best', 'bbp', 'bests'],
            argsInfo: '[user] (#number) (:mode)',
            args: ['userStringWithoutBeatmap', 'limitString', 'modeString'],
            argNecessity: [2, -1, -1],
        }, {
            type: 'api_bp_rx',
            info: 'bp成绩查询（省略#number则输出bp5）（relax模式）',
            command: ['bprx', 'bestrx', 'bbprx', 'bestsrx'],
            argsInfo: '[user] (#number) (:mode)',
            args: ['userStringWithoutBeatmap', 'limitString', 'modeString'],
            argNecessity: [2, -1, -1],
        }, {
            type: 'api_ranknumber',
            info: '查询成绩统计数量',
            command: ['rn'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1]
        }, {
            type: 'api_ranknumber_rx',
            info: '查询成绩统计数量（relax模式）',
            command: ['rnrx', 'rxrn'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1]
        }, {
            type: 'api_todaybp',
            info: '今日bp列表查询',
            command: ['todaybp'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1],
        }, {
            type: 'api_todaybp_rx',
            info: '今日bp列表查询（relax模式）',
            command: ['todaybprx'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1],
        }, {
            type: 'api_recent',
            info: '获取最近成绩（包括未pass成绩）',
            command: ['r', 'rct', 'rctpp', 'recent'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1],
        }, {
            type: 'api_recent_rx',
            info: '获取最近成绩（包括未pass成绩）（relax模式）',
            command: ['rrx', 'rctrx', 'rctpprx', 'recentrx'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1],
        }, {
            type: 'api_recent_passed',
            info: '获取最近成绩（不包括未pass成绩）',
            command: ['pr', 'prsb'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1],
        }, {
            type: 'api_recent_passed_rx',
            info: '获取最近成绩（不包括未pass成绩）（relax模式）',
            command: ['prrx'],
            argsInfo: '[user] (:mode)',
            args: ['userStringWithoutBeatmap', 'modeString'],
            argNecessity: [2, -1],
        }
    ]
}


module.exports = CommandsInfo;