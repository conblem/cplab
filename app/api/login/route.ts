import { signIn } from "@/auth";

// by default, you have to select which provider
// you want to log in this way we default to zitadel
export const GET = async function GET() {
  await signIn("zitadel");
};
