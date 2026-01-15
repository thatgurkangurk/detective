import { treaty } from "@elysiajs/eden";
import type { API } from "../../lib/web";

export const app = treaty<API>(location.origin);
