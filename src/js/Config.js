class ConfigUtils {

    static apiUrl = 'http://95.84.140.16:81/api'

    static prepareRequestUrl(path) {
        return "/api" + path;
    }

}

export default ConfigUtils;