import { initClient } from "@ts-rest/core";
import { contract } from "@/app/api/rest/[...ts-rest]/contract";

export default initClient(contract, {
  // baseUrl: `${location.protocol}//${location.host}`,
  baseUrl: `https://${process.env.VERCEL_URL}`,
  baseHeaders: {},
});
