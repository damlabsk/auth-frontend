import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADhWJGUeaNkTWOJ9rV_iCzc9ERXXjpcw0",
  authDomain: "auth-f44c7.firebaseapp.com",
  projectId: "auth-f44c7",
  storageBucket: "auth-f44c7.firebasestorage.app",
  messagingSenderId: "918123460775",
  appId: "1:918123460775:web:1ed32284527723a8064382",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google provider (hesap seçme ekranı zorunlu)
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// GitHub provider
export const githubProvider = new GithubAuthProvider();

// Microsoft provider (hesap seçme ekranı zorunlu)
export const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.setCustomParameters({
  prompt: "select_account",
});

// LinkedIn (OIDC)
export const linkedinProvider = new OAuthProvider("oidc.auth-linkedin");