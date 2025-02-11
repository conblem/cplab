import { initClient } from "@ts-rest/core";
import { contract } from "@/app/api/rest/[...ts-rest]/contract";

export default initClient(contract, {
  baseUrl: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `${location.protocol}//${location.host}`,
  baseHeaders: {},
});
