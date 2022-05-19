import axios from "axios";
import axiosRetry from "axios-retry";
const baseURL = process.env.NODE_ENV === "production"? "/api/v1":"http://localhost:3005/api/v1"
const SourceFinder = axios.create({
  baseURL,
});

axiosRetry(SourceFinder, { retries: 3 });

export default SourceFinder;