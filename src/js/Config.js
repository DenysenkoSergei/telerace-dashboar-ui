class ConfigUtils {

    static apiUrl = 'https://hub.telerace.ru/api'

    static prepareRequestUrl(path) {
        return this.apiUrl + path;
    }

}

export default ConfigUtils;