const whatsAppClient = require("@green-api/whatsapp-api-client");
const logger = require('../log');
const util = require('util');

function run(trigger, scope, data, config, callback) {
    // Safe access to WhatsApp config
    const wConf = data.pluginconf?.WhatsApp;

    if (!wConf) {
        logger.main.warn('WhatsApp config not found in data.pluginconf.');
        callback();
        return;
    }

    if (!wConf.enable) {
        logger.main.info('WhatsApp plugin is disabled.');
        callback();
        return;
    }

    const ID_INSTANCE = config?.idInstance;
    const API_TOKEN_INSTANCE = config?.apiTokenInstance;
    const GROUP_ID = wConf.groupId;

    if (!ID_INSTANCE || !API_TOKEN_INSTANCE || !GROUP_ID) {
        logger.main.error('WhatsApp: Missing ID_INSTANCE, API_TOKEN_INSTANCE, or Group ID in config.');
        callback();
        return;
    }

    const restAPI = whatsAppClient.restAPI({
        idInstance: ID_INSTANCE,
        apiTokenInstance: API_TOKEN_INSTANCE
    });

    const messageText = `📢 *${data.agency || 'Agency'} - ${data.alias || 'Alias'}*\n\n${data.message || ''}`;

    restAPI.message.sendMessage(GROUP_ID, null, messageText)
        .then((response) => {
            logger.main.info('WhatsApp: Message sent successfully');
            logger.main.debug(util.format('%o', response));
            callback();
        })
        .catch((err) => {
            logger.main.error('WhatsApp Error: ' + err);
            callback();
        });
}

module.exports = {
    run
};
