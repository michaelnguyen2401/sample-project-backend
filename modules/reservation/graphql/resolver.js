const { EXAMINATION } = require('../types');
const moment = require('moment');
const { ObjectId } = require('mongodb');

module.exports = {
  Query: {
    reservation: async (_, { }, { container }) => {
      return 'reservation';
    },
  },

  Mutation : {
    createReservationRequest: async (_, {reservation}, { container, req }) => {
      const [zaloMessageSender, reservationTemplateProvider, reservationRequestProvider] = [
        container.resolve('zaloMessageSender'), 
        container.resolve('reservationTemplateProvider'),
        container.resolve('reservationRequestProvider')
      ];

      const {bookingOptions, patient} = reservation;
      const examinationDate = moment(bookingOptions[0].time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
      let examinationTemplate = await reservationTemplateProvider.findByType(EXAMINATION);

      const elementList = bookingOptions.map(o => {
        const examTime = moment(o.time, 'YYYY-MM-DD HH:mm').format('HH:mm');
        return {
          title: `${examinationTemplate.element.title} ${o.doctor} ${examinationTemplate.element.time} ${examTime}`,
          image_url: examinationTemplate.element.image_url,
          default_action: {
            type: examinationTemplate.element.default_action.type,
            url: `https://b3e2e570.ngrok.io/api/zalo/handlerClick?type=examination&zaloPatientId=${patient}&zaloDoctorId=${o.doctor}&time=${o.time}`
          }
        }
      });

      const elements = [{
        title: `${examinationTemplate.header.title} ${examinationDate}`,
        subtitle: examinationTemplate.header.subtitle,
        image_url: examinationTemplate.header.image_url
      }, ... elementList];

      let message = examinationTemplate.message;
      message.attachment.payload.elements = elements;

      const zaLoResponse = await zaloMessageSender.sendMessage(message, {zaloId: patient});
      const zaloMessageId = zaLoResponse.data.message_id;

      if(zaLoResponse.error) {
        console.log('Sender message fail');
        return 'send zalo message fail'
      }

      const reservationRequest = {
        source : "zalo",
        zaloMessageId: zaloMessageId,
        zaloRecipientId: patient,
        zaloSenderId: "4368496045530866759",
        cleverSenderId: ObjectId(req.user.id),
        payload: reservation, 
        timestamp: moment().valueOf(),
      }

      const result = await reservationRequestProvider.create(reservationRequest);

      return result;
    },
  }
};
