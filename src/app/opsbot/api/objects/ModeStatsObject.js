const utils = require('../utils');


class ModeStatsObject {
    constructor(modeStats) {
        if (modeStats) {
            this.accuracy = parseFloat(modeStats.accuracy.toFixed(2));
            this.playcount = modeStats.playcount;
            this.level = parseFloat(modeStats.level.toFixed(2));
            this.countryRank = modeStats.country_leaderboard_rank || 0;
            this.rank = modeStats.global_leaderboard_rank || 0;
            this.pp = modeStats.pp;
            this.rankedScores = modeStats.ranked_score;
            this.play_time = modeStats.play_time || 0;
        }
    }

    toString() {
        let output = "";
        output = output + "acc：" + this.accuracy + "%\n";
        output = output + "等级：" + this.level + "\n";
        output = output + "pp：" + this.pp + "\n";
        output = output + "全服排名：#" + this.rank + "\n";
        //output = output + "本地排名：" + this.countryRank + "\n";
        output = output + "游玩次数：" + this.playcount + "\n";
        output = output + "rank总分：" + utils.format_number(this.rankedScores) + "\n";
        output = output + "游戏时长：" + utils.getUserTimePlayed(this.play_time) + "\n";

        return output;
    }
}


module.exports = ModeStatsObject;