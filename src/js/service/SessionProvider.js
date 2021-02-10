import ConfigUtils from "../Config";
import axios from 'axios';

class SportsmanProvider {

    static loadSportsmen(callback) {
        axios.get(
            ConfigUtils.prepareRequestUrl("/athlete")).then(callback)
    }

    static storeSession(session) {
        window.localStorage.setItem("session", JSON.stringify(session));
    }

    static getSessionFromLocalstorage() {
        return JSON.parse(window.localStorage.getItem("session"));
    }

    static removeFromLocalstorage() {
        return window.localStorage.removeItem("session");
    }

    static createNewSession(session, callback) {
        axios
            .post(ConfigUtils.prepareRequestUrl("/session"), session)
            .then(response => callback(response));
    }

    static performStopSessionRequest(session) {
        axios.put(
            ConfigUtils.prepareRequestUrl("/session/" + session.id),
            {
                "id": session.id,
                "session_start": session.start_date,
                "session_end": new Date().toISOString().split('.')[0],
                "session_description": session.session_description,
                "session_group": session.session_group,
                "session_state": "closed"
            }
        ).then(r => console.log(r));
    }

}

export default SportsmanProvider;