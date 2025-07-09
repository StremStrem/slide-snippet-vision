import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCK67CvGv1bzXlM0QgMTCTWhd3cecpF3ZQ",
  authDomain: "slide-snip.firebaseapp.com",
  projectId: "slide-snip",
  storageBucket: "slide-snip.firebasestorage.app",
  messagingSenderId: "265210284989",
  appId: "1:265210284989:web:87de070e3b9f95d19e20d4",
  measurementId: "G-NY3MZRWLK9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);