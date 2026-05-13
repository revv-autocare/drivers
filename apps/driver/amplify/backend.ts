import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { notifyFn } from "./functions/notifications/resource";

defineBackend({
  auth,
  data,
  storage,
  notifyFn,
});
