const moment = require("moment-timezone");

const getTime = {
  currDate: function () {
    return moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
  },
  currTime: function () {
    return moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
  },
  current: function () {
    return moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
  },
  currenUnix: function () {
    return moment().tz("Asia/Ho_Chi_Minh").valueOf();
  },
  startDateUnix: function () {
    return moment().tz("Asia/Ho_Chi_Minh").startOf("day").unix();
  },
  endDate: function () {
    return moment()
      .tz("Asia/Ho_Chi_Minh")
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
  },
  endDateUnix: function () {
    return moment().tz("Asia/Ho_Chi_Minh").endOf("day").unix();
  },
  currentM: function () {
    return moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm");
  },
  date: function (date) {
    return moment(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
  },
  time: function (date) {
    return moment(date).tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
  },
  timeHm: function (date) {
    return moment(date).tz("Asia/Ho_Chi_Minh").format("HH:mm");
  },
  Unix2String: function (value) {
    return moment
      .unix(value)
      .tz("Asia/Ho_Chi_Minh")
      .format("YYYY-MM-DD HH:mm:ss");
  },
  Unix2StringFormat: function (value) {
    return moment
      .unix(value)
      .tz("Asia/Ho_Chi_Minh")
      .format("HH:mm:ss DD/MM/YYYY");
  },
  format: function (date, type = { time: "HH:mm:ss", date: "DD/MM/YYYY" }) {
    const isValidDate = moment(date, true).isValid();
    return isValidDate
      ? moment(date).tz("Asia/Ho_Chi_Minh").format(`${type.time} ${type.date}`)
      : date;
  },
  formatDate: function (date) {
    return moment(date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
  },
  formatTime: function (date) {
    return moment(date).tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
  },
  String2Unit: function (value) {
    return moment(value).tz("Asia/Ho_Chi_Minh").unix();
  },
  caculateTime: function (totalseconds) {
    const day = 86400;
    const hour = 3600;
    const minute = 60;

    const daysout = Math.floor(totalseconds / day);
    const hoursout = Math.floor((totalseconds - daysout * day) / hour);
    const minutesout = Math.floor(
      (totalseconds - daysout * day - hoursout * hour) / minute
    );
    const secondsout =
      totalseconds - daysout * day - hoursout * hour - minutesout * minute;

    const dayString = daysout ? `${daysout} ngày` : "";
    const hourString = hoursout ? `${hoursout} giờ` : "";
    const minuteString = minutesout ? `${minutesout} phút` : "";
    const secondString = secondsout ? `${secondsout} giây` : "";

    return `${dayString} ${hourString} ${minuteString} ${secondString}`;
  },
};

module.exports = getTime;
