const { ZALO_MESSAGE_SENT, ZALO_MESSAGE_CREATED } = require('../../zaloMessage/events');

class OASendImageEventHandler {
  constructor(zaloInterestedUserProvider, userProvider, zaloMessageProvider, pubsub) {
    this.zaloInterestedUserProvider = zaloInterestedUserProvider;
    this.userProvider = userProvider;
    this.zaloMessageProvider = zaloMessageProvider;
    this.pubsub = pubsub;
  }

  /**
   *
   * @param data
   * @returns {Promise<void>}
   */
  async handle(data) {
    const message = await this.zaloMessageProvider.findByZaloMessageId(data.message.msg_id);
    if (message) {
      const updatedMessage = await this.zaloMessageProvider.update(message.id, {
        attachments: data.message.attachments,
      });

      await Promise.all([
        this.pubsub.publish(ZALO_MESSAGE_SENT, { onZaloMessageSent: updatedMessage.toJson() }),
        this.pubsub.publish(ZALO_MESSAGE_CREATED, { onZaloMessageCreated: updatedMessage.toJson() }),
      ]);

      return updatedMessage;
    }

    const [OAUser, interestedUser] = await Promise.all([
      this.userProvider.findByZaloId(data.sender.id),
      this.zaloInterestedUserProvider.findByZaloId(data.user_id_by_app),
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
    });

    await Promise.all([
      this.pubsub.publish(ZALO_MESSAGE_SENT, { onZaloMessageSent: createdMessage.toJson() }),
      this.pubsub.publish(ZALO_MESSAGE_CREATED, { onZaloMessageCreated: createdMessage.toJson() }),
    ]);

    return createdMessage;
  }

  static getEvent() {
    return 'oa_send_image';
  }
}

module.exports = OASendImageEventHandler;
