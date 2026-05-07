import { defineAuth } from "@aws-amplify/backend";

/**
 * Cognito User Pool with three groups for role separation:
 *   - driver       (default — drivers using the PWA)
 *   - shop_member  (service advisors / techs working at a Shop)
 *   - admin        (Revv internal staff)
 *
 * Groups are assigned post-signup. Drivers self-serve; shop_members and
 * admins are added via the admin app's onboarding flows.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: true,
  },
  userAttributes: {
    email: { required: true, mutable: true },
    phoneNumber: { required: false, mutable: true },
    givenName: { required: false, mutable: true },
    familyName: { required: false, mutable: true },
    preferredUsername: { required: false, mutable: true },
  },
  groups: ["driver", "shop_member", "admin"],
});
