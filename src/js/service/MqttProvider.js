import { connect } from 'mqtt';

class MqttProvider {

    static client = connect('mqtt://95.84.140.16:9001');

    static initMqtt(sensorCallback, statisticCallBack) {
        let client = MqttProvider.client;

        client.on('message', function (topic, message) {
            if (topic === 'telerace/sensors_data') {
                sensorCallback(topic, message);
            } else {
                statisticCallBack(topic, message);
            }
        })
    }

    static subscribeToMqtt() {
        MqttProvider.client.subscribe('telerace/sensors_data', function (err) {})
        MqttProvider.client.subscribe('telerace/statistic_data', function (err) {})
    }

}

export default MqttProvider;