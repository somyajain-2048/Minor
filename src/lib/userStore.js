// import { create } from 'zustand';
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// // import { auth } from "./firebase";

// export const useUserStore = create((set) => ({
//   currentUser : null,
// 	isLoading:true,
// 	fetchUserInfo: async (uid) =>{
//    if(!uid) return set({currentUser:null,isLoading : false});

// 	 try{

// 		const docRef = doc(db,"users" ,uid);
// 		const docSnap = await getDoc(docRef);

// 		if(docSnap.exists()){
// 			set({currentUser : docSnap.data() , isLoading:false});
// 		}
// 		else{
// 			set({currentUser:null , isLoading:false});
// 		}

// 	 }catch(err){
// 		console.log(err)
// 		return set({currentUser : null, isLoading:false});
// 	 }
// 	},

// }))


import { create } from "zustand";
import { getFirestore, doc, getDoc } from "firebase/firestore"; 
import { auth } from "./firebase"; // Ensure this path matches your setup

// Initialize Firestore
const db = getFirestore();

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  
  fetchUserInfo: async (uid) => {
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }

    try {
      // Reference the user document in Firestore
      const docRef = doc(db, "users", uid); // Replace "users" with your Firestore collection name
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Update the state with user data
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        console.warn(`No document found for user ID: ${uid}`);
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
