
// import { getAuth }from "firebase/auth";
// import {getFirestore} from "firebase/firestore";
// import {getStorage} from "firebase/storage";


// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyBT4ymeeoxSizCZHega3MZpGgV-gCdqTjQ",
//   authDomain: "chatapp-6f200.firebaseapp.com",
//   projectId: "chatapp-6f200",
//   storageBucket: "chatapp-6f200.firebasestorage.app",
//   messagingSenderId: "169756873245",
//   appId: "1:169756873245:web:c05fac36221d8819acecf4"
// };



// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app)
// export const db =getFirestore(app)
// export const storage = getStorage(app)



import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBT4ymeeoxSizCZHega3MZpGgV-gCdqTjQ",
  authDomain: "chatapp-6f200.firebaseapp.com",
  projectId: "chatapp-6f200",
  storageBucket: "chatapp-6f200.appspot.com", // Corrected this line
  messagingSenderId: "169756873245",
  appId: "1:169756873245:web:c05fac36221d8819acecf4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
