import ConfigUtils from "../Config";
import axios from 'axios';

class SportsmanProvider {

    static loadSportsmen(callback) {
        axios.get(
            ConfigUtils.prepareRequestUrl("/athlete"))
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