import { connect } from 'mqtt';

class MqttProvider {

    // static client = connect('mqtt://localhost:9001');
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

    static stopClient() {
        MqttProvider.client.end();
    }

    static subscribeToMqtt() {
        MqttProvider.client.subscribe('telerace/sensors_data', function (err) {})
        MqttProvider.client.subscribe('telerace/statistic_data', function (err) {})
    }

    static unsubscribeToMqtt() {
        MqttProvider.client.unsubscribe('telerace/sensors_data', function (err) {})
        MqttProvider.client.unsubscribe('telerace/statistic_data', function (err) {})
    }

}

export default MqttProvider;