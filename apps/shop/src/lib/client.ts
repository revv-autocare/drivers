import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../driver/amplify/data/resource";

export type { Schema };
export const apiClient = generateClient<Schema>();
