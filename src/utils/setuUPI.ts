import { SetuUPIDeepLink } from "@setu/upi-deep-links";

export const upiDL = SetuUPIDeepLink({
  schemeID: process.env.NEXT_PUBLIC_SCHEME_ID!,
  secret: process.env.NEXT_PUBLIC_SECRET!,
  productInstanceID: process.env.NEXT_PUBLIC_PRODUCT_INSTANCE_ID!,
  mode: "SANDBOX",
  authType: "JWT",
});
