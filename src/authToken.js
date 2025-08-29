// src/authToken.js
import { auth } from "./firebase";
import { onIdTokenChanged } from "firebase/auth";

let latestToken = null;

export async function getIdToken({ log = true, mask = true } = {}) {
  const u = auth.currentUser;
  if (!u) {
    if (log) console.warn("getIdToken: no current user");
    return null;
  }
  const t = await u.getIdToken(false);
  if (log) {
    if (mask) console.log("Firebase ID token:", `${t.slice(0, 12)}...${t.slice(-12)} (len=${t.length})`);
    else console.log("Firebase ID token:", t);
  }
  return t;
}

// keep latest token fresh without you doing anything
onIdTokenChanged(auth, async (u) => {
  latestToken = u ? await u.getIdToken(false) : null;
});

// useful when you just need “whatever we have now”
export function peekToken() {
  return latestToken;
}
