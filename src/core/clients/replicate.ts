import axios from "axios";

const replicateClient = axios.create({
  baseURL: "https://api.replicate.com/",
  headers: {
    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    "Accept-Encoding": "*",
  },
});

export default replicateClient;
