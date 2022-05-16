import axios from "axios";
import axiosRetry from "axios-retry";

const SourceFinder = axios.create({
  baseURL:
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3005/api/v1"
      : "http://localhost:3005/api/v1",
});

axiosRetry(SourceFinder, { retries: 3 });

export default SourceFinder;