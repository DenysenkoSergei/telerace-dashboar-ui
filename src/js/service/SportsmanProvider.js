import ConfigUtils from "../Config";
import axios from 'axios';

class SportsmanProvider {

    static loadSportsmen(callback) {
        axios.get(
            ConfigUtils.prepareRequestUrl("/athlete"),
            {
                headers: {
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
                }
            }
        )
            .then(callback)
    }

    static storeSportsmen(sportsmenList) {
        sportsmenList.forEach(sportsman => {
            window.localStorage.setItem("sportsman_" + sportsman.id, JSON.stringify(sportsman));
        })
    }

    static getSportsmanFromCache(sportsmanId) {
        return JSON.parse(window.localStorage.getItem("sportsman_" + sportsmanId));
    }
}

export default SportsmanProvider;