const nodemailer = require('nodemailer');
const { getCache } = require('./cache.js');
const { user, order, notification, settings, Sequelize, sequelize, order_item } = require('../models');

// Email created on order confirmation
exports.orderConfirmEmail = async function (customerId) {
  const customer = await user.findOne({ where: { id: customerId } });

  let emailTemplate = await getSetting('order_confirmation_template');
  emailTemplate = personalizeEmail(customer.fullName, emailTemplate);

  const mailOptions = createMailOptions(customer.email, emailTemplate);
  sendEmail(mailOptions);
};

// Email created on all item arrival / order preparation completion at the shop
exports.orderArrivedEmail = async function (orderId) {
  const customer = await order.findOne({
    where: {
      id: orderId
    },
    include: [user],
    attributes: ['user.id', 'user.full_name', 'user.email']
  });

  let emailTemplate = await getSetting('order_arrived_template');
  emailTemplate = personalizeEmail(customer.user.fullName, emailTemplate);

  const mailOptions = createMailOptions(customer.user.email, emailTemplate);
  sendEmail(mailOptions);

  setUpRecurrenceEmail(customer.user.id, orderId);
};

// Creates a notification table entry for the recurrence email
async function setUpRecurrenceEmail (userId, orderId) {
  await notification.create(
    {
      userId,
      orderId,
      lastSent: new Date().toISOString().split('T')[0]
    });
}
// Send notification for all items that should arrive
exports.itemArrivedEmail = async function () {
  const salesperson = await user.findOne({
    where: {
      id: 'ac5554bb-d628-441a-ac1a-29cf60deab9c'
    },
    attributes: ['email']
  });
  const items = await order_item.findAll({
    where: {
      deliveryDate: new Date().toISOString().split('T')[0],
      deleted: false
    },
    attributes: ['itemId']
  });
  const allItems = items.map(item => {
    return `${item.itemId}`;
  }).join(', ');

  let emailTemplate = await getSetting('item_arrival_template');
  emailTemplate = createItemBody(allItems, emailTemplate);

  const mailOptions = createMailOptions(salesperson.email, emailTemplate);
  if (items.length !== 0) { sendEmail(mailOptions); }
};

// Send all recurring emails for the day
exports.sendRecurringEmails = async function () {
  const emailTemplate = await getSetting('order_pickup_template');
  const recurrenceSetting = await getSetting('order_pickup_recurrence');

  let date = new Date();
  date.setDate(date.getDate() - recurrenceSetting.value.recurrence);
  date = date.toISOString().split('T')[0];

  const listOfNotifications = await notification.findAll({
    where: {
      last_sent: {
        [Sequelize.Op.lte]: date
      },
      deleted: false
    },
    include: {
      model: user,
      attributes: ['full_name', 'email']
    }
  });

  listOfNotifications.forEach(notif => {
    const userEmail = personalizeEmail(notif.user.fullName, emailTemplate);
    const mailOptions = createMailOptions(notif.user.email, userEmail);
    sendEmail(mailOptions);

    const todaysDate = new Date().toISOString().split('T')[0];
    notif.set({
      lastSent: new Date().toISOString().split('T')[0],
      sentHistory: sequelize.fn('array_append', sequelize.col('sent_history'), todaysDate)
    });
    notif.save();
  });
};

// Email sender
function sendEmail (mailOptions) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) console.log(error);
  });
};

// Helper functions for this file
function createMailOptions (customerEmail, template) {
  return {
    from: process.env.EMAIL,
    to: customerEmail,
    subject: template.value.title,
    text: template.value.body
  };
}

async function getSetting (keyToGet) {
  const cacheSettings = getCache('settings');
  let setting = null;

  if (!cacheSettings) {
    setting = await settings.findOne({
      where: { key: keyToGet }
    });
  } else {
    setting = cacheSettings.find(item => item.key === keyToGet);
  }

  return setting;
}

function personalizeEmail (customerName, emailTemplate) {
  const personalEmailTemplate = emailTemplate;

  personalEmailTemplate.value.body = emailTemplate.value.body.replace('customerName', customerName);

  return personalEmailTemplate;
}

function createItemBody (items, emailTemplate) {
  const personalEmailTemplate = emailTemplate;

  personalEmailTemplate.value.body = personalEmailTemplate.value.body.replace('itemList', items);

  return personalEmailTemplate;
}
