const { ZALO_MESSAGE_SENT, ZALO_MESSAGE_CREATED } = require('../../zaloMessage/events');

class OASendFileEventHandler {
  constructor(zaloSAProvider, zaloOAProvider, zaloMessageProvider, pubsub) {
    this.zaloSAProvider = zaloSAProvider;
    this.zaloOAProvider = zaloOAProvider;
    this.zaloMessageProvider = zaloMessageProvider;
    this.pubsub = pubsub;
  }

  async handle(data) {
    const message = await this.zaloMessageProvider.findByZaloMessageId(data.message.msg_id);
    if (message) {
      return message;
    }

    const [OAUser, interestedUser] = await Promise.all([
      this.zaloOAProvider.find({ oaId: data.sender.id }),
      this.zaloSAProvider.find({
        followings: {
          $match: {
            appId: data.app_id, zaloIdByApp: data.user_id_by_app, zaloIdByOA: data.recipient.id, oaId: data.sender.id, state: 'PHONE_NUMBER_PROVIDED',
          },
        },
      }),
    ]);

    const createdMessage = await this.zaloMessageProvider.create({
      timestamp: data.timestamp,
      from: {
        id: OAUser.id,
        displayName: OAUser.name,
        avatar: OAUser.image.link,
      },
      content: data.message.text,
      attachments: data.message.attachments,
      to: {
        id: interestedUser.id,
        displayName: interestedUser.displayName,
        avatar: interestedUser.avatar,
      },
      zaloMessageId: data.message.msg_id,
      type: 'File',
    });

    await Promise.all([
      this.pubsub.publish(ZALO_MESSAGE_SENT, { onZaloMessageSent: createdMessage.toJson() }),
      this.pubsub.publish(ZALO_MESSAGE_CREATED, { onZaloMessageCreated: createdMessage.toJson() }),
    ]);

    return createdMessage;
  }

  static getEvent() {
    return 'oa_send_file';
  }
}

module.exports = OASendFileEventHandler;
