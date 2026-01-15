import { atomWithStorage } from "jotai/utils";

export const passwordAtom = atomWithStorage<string>("web_password", "");
