import { defineFunction, secret } from "@aws-amplify/backend";

export const notifyFn = defineFunction({
  name: "revv-notify",
  entry: "./handler.ts",
  environment: {
    TWILIO_ACCOUNT_SID: secret("TWILIO_ACCOUNT_SID"),
    TWILIO_AUTH_TOKEN:  secret("TWILIO_AUTH_TOKEN"),
    TWILIO_FROM_NUMBER: secret("TWILIO_FROM_NUMBER"),
  },
  timeoutSeconds: 15,
});
