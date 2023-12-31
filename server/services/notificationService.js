const nodemailer = require('nodemailer');
const { getCache } = require('../utils/cache.js');
const { item, user, order, notification, settings, Sequelize, sequelize, order_item } = require('../db/models');

// Email created on order confirmation by the sales person
exports.orderConfirmEmail = async function (customerId) {
  const customer = await user.findOne({ where: { id: customerId } });

  let emailTemplate = await getSetting('order_confirmation_template');
  emailTemplate = personalizeEmailTemplate(customer.fullName, emailTemplate);

  const email = createEmail(customer.email, emailTemplate);
  sendEmail(email);
};

// Email created when all items are ready for pickup by the customer
exports.orderReadyEmail = async function (orderId) {
  const customer = await order.findOne({
    where: {
      id: orderId
    },
    include: [user],
    attributes: ['user.id', 'user.full_name', 'user.email']
  });

  let emailTemplate = await getSetting('order_ready_template');
  emailTemplate = personalizeEmailTemplate(customer.user.fullName, emailTemplate);

  const email = createEmail(customer.user.email, emailTemplate);
  sendEmail(email);

  setUpRecurrenceEmail(customer.user.id, orderId);
};

// Creates a notification table entry for a pick up reminder recurrence email
const setUpRecurrenceEmail = async function (userId, orderId) {
  try {
    await notification.create(
      {
        userId,
        orderId,
        lastSent: new Date().toISOString().split('T')[0]
      });
  } catch (error) {
    console.log(error);
  }
};

// Send notifications for all items that should arrive on this date
exports.verifyItemArrivedEmail = async function () {
  const salesperson = await user.findOne({
    where: {
      id: '20c1297e-58f6-4587-842b-231ff6583086'
    },
    attributes: ['email']
  });
  const items = await order_item.findAll({
    where: {
      deliveryDate: new Date().toISOString().split('T')[0],
      deleted: false
    },
    include: [item],
    attributes: ['item.name', 'item.serial_number']
  });

  const allItems = items.map(order_item => {
    const itemInfo = order_item.item;
    return `${itemInfo.name} ${itemInfo.serialNumber}`;
  }).join(',<br>');

  let emailTemplate = await getSetting('item_arrival_template');
  emailTemplate = createItemBody(allItems, emailTemplate);

  const email = createEmail(salesperson.email, emailTemplate);
  if (items.length !== 0) { sendEmail(email); }
};

// Send all recurring emails for the day
exports.sendRecurringEmails = async function () {
  const emailTemplate = await getSetting('order_pickup_template');
  const recurrenceSetting = await getSetting('order_pickup_recurrence');

  // Date is adjusted based on recurrence value, to check which notifications must be sent again
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
    const userEmail = personalizeEmailTemplate(notif.user.fullName, emailTemplate);
    const email = createEmail(notif.user.email, userEmail);
    sendEmail(email);

    const todaysDate = new Date().toISOString().split('T')[0];
    notif.set({
      lastSent: todaysDate,
      sentHistory: sequelize.fn('array_append', sequelize.col('sent_history'), todaysDate)
    });
    notif.save();
  });
};

// Email sender
const sendEmail = function (email) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  transporter.sendMail(email, function (error, info) {
    if (error) console.log(error);
  });
};

// Helper functions for this file
// //

// Creates an email using the provided template and email address
const createEmail = function (emailAddress, emailTemplate) {
  return {
    from: process.env.EMAIL,
    to: emailAddress,
    subject: emailTemplate.value.title,
    html: emailTemplate.value.body
  };
};

// Get settings from cache containing notification templates and recurrence
const getSetting = async function (keyToGet) {
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
};

// Create personalized email template for a customer
const personalizeEmailTemplate = function (customerName, emailTemplate) {
  const personalEmailTemplate = emailTemplate;

  personalEmailTemplate.value.body = emailTemplate.value.body.replace('customerName', customerName);

  return personalEmailTemplate;
};

// Create personalized email template for items arrival
const createItemBody = function (items, emailTemplate) {
  const personalEmailTemplate = emailTemplate;

  personalEmailTemplate.value.body = personalEmailTemplate.value.body.replace('itemList', items);

  return personalEmailTemplate;
};
