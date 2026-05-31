import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQFl1asKKtDEBUhKEUCnyhzbS14SScCQU",
  authDomain: "solarindustryproject.firebaseapp.com",
  projectId: "solarindustryproject",
  storageBucket: "solarindustryproject.firebasestorage.app",
  messagingSenderId: "143875456949",
  appId: "1:143875456949:web:fb3dfa7c01c202482c23fc",
  measurementId: "G-934FHX5M2D"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
