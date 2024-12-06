// import {
//   query,
//   collection,
//   where,
//   setDoc,
//   getDocs,
//   serverTimestamp,
//   doc,
//   arrayUnion,
// } from "firebase/firestore";
// import "./adduser.css";
// import { db } from "../../../../lib/firebase";
// import { useState } from "react";

// import { useUserStore } from "../../../lib/userStore";
// const AddUser = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState("");

//   const { currentUser } = useUserStore();

//   const handleSearch = async (e) => {
//     e.preventDefault(); // Prevent form refresh
//     const formData = new FormData(e.target);
//     const username = formData.get("username");

//     try {
//       const userRef = collection(db, "users");
//       const q = query(userRef, where("username", "==", username));
//       const querySnapShot = await getDocs(q);

//       if (!querySnapShot.empty) {
//         setUser(querySnapShot.docs[0].data());
//         setError(""); // Clear any previous errors
//       } else {
//         setUser(null);
//         setError("No user found with that username.");
//       }
//     } catch (err) {
//       console.error("Error searching for user:", err);
//       setError("An error occurred while searching.");
//     }
//   };

//   const handleAdd = async () => {
//     const chatRef = collection(db, "chats");

//     try {
//       const newChatRef = doc(chatRef);
//       await setDoc(newChatRef, {
//         createdAt: serverTimestamp(),
//         messages: [],
//       });

//       await updateDoc(doc(userChatsRef, user.id), {
//         chats: arrayUnion({
//           chatId: newChatRef.id,
//           lastMessage: "",
//           receiverId: currentUser.id,
//           updatedAt: Date.now(),
//         }),
//       });

//       await updateDoc(doc(userChatsRef, currentUser.id), {
//         chats: arrayUnion({
//           chatId: newChatRef.id,
//           lastMessage: "",
//           receiverId: user.id,
//           updatedAt: Date.now(),
//         }),
//       });

//       console.log("Chat ID:", newChatRef.id);
//       alert("User added successfully!");
//     } catch (err) {
//       console.error("Error adding user:", err);
//       alert("Failed to add user. Please try again.");
//     }
//   };

//   return (
//     <div className="addUser">
//       <form onSubmit={handleSearch}>
//         <input type="text" placeholder="Username" name="username" required />
//         <button type="submit">Search</button>
//       </form>

//       {error && <p className="error">{error}</p>}

//       {user && (
//         <div className="user">
//           <div className="detail">
//             <img src={user.avatar || "./avatar.png"} alt="Avatar" />
//             <span>{user.username}</span>
//           </div>
//           <button onClick={handleAdd}>Add User</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddUser;

//

import {
  query,
  collection,
  where,
  setDoc,
  getDocs,
  serverTimestamp,
  doc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import "./adduser.css";
import { db } from "../../../../lib/firebase";
import { useState } from "react";

import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Extract currentUser from the store
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const foundUser = querySnapshot.docs[0];
        setUser({ id: foundUser.id, ...foundUser.data() }); // Include the document ID
        setError("");
      } else {
        setUser(null);
        setError("No user found with that username.");
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setError("An error occurred while searching.");
    }
  };

  const handleAdd = async () => {
    if (!currentUser || !user) {
      setError("Missing user or current user information.");
      return;
    }

    try {
      const chatRef = collection(db, "chats");
      const userChatsRef = collection(db, "userChats");

      // Create a new chat document
      const newChatRef = doc(chatRef); // Generate a new document reference
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const currentUserChatData = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: user.id,
        receiverName: user.username,
        receiverAvatar: user.avatar || "./avatar.png",
        updatedAt: Date.now(),
      };

      const userChatData = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: currentUser.id,
        receiverName: currentUser.username,
        receiverAvatar: currentUser.avatar || "./avatar.png",
        updatedAt: Date.now(),
      };

      await setDoc(
        doc(userChatsRef, currentUser.id),
        { chats: [] },
        { merge: true }
      );
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion(currentUserChatData),
      });

      await setDoc(doc(userChatsRef, user.id), { chats: [] }, { merge: true });
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion(userChatData),
      });

      console.log("Chat ID:", newChatRef.id);
      alert("User added successfully!");
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" required />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="Avatar" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
