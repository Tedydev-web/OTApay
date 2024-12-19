const { default: axios } = require("axios");
const configureEnvironment = require("../config/dotenv.config");

const { SV_REAL_ALARM } = configureEnvironment();
const axiosAlarm = axios.create({
  baseURL: SV_REAL_ALARM,
});

const handleRes = (response) => {
  if (response && response.data) {
    return response.data;
  }

  return response;
};

const handleError = (error) => {
  // console.log("error", error);
  // Handle errors
  throw error?.response?.data || error;
};

axiosAlarm.interceptors.response.use(handleRes, handleError);

module.exports = { axiosAlarm };
