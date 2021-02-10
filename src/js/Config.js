class ConfigUtils {

    static apiUrl = 'http://95.84.140.16:81/api'

    static prepareRequestUrl(path) {
        return this.apiUrl + path;
    }

}

export default ConfigUtils;