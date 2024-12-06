// import Detail from "./components/detail/detail";
// import Chat from "./components/chat/Chat";
// import List from "./components/list/list";
// import Login from "./components/login/Login";
// import Notification from "./components/notification/Notification";
// import { onAuthStateChanged } from "firebase/auth";
// import { useUserStore } from "./lib/userStore";
// import { useEffect } from "react";
// import { auth } from "./lib/firebase";
// import { useChatStore } from "./lib/chatStore";

// const App = () => {
//   const { currentUser, isLoading, fetchUserInfo } = useUserStore();
//   const { chatId } = useChatStore();

//   useEffect(() => {
//     const unSub = onAuthStateChanged(auth, (user) => {
//       console.log(user);
//       fetchUserInfo(user?.uid);
//     });
//     return () => {
//       unSub();
//     };
//   }, [fetchUserInfo]);

//   console.log("Current User:", currentUser);

//   if (isLoading) return <div className="loading">Loading...</div>;

//   return (
//     <div className="container">
//       {currentUser ? (
//         <>
//           <List />
//           {chatId && <Chat />}
//           {chatId && <Detail />}
//         </>
//       ) : (
//         <Login />
//       )}
//       <Notification />
//     </div>
//   );
// };

// export default App;

import Detail from "./components/detail/detail";
import Chat from "./components/chat/Chat";
import List from "./components/list/list";
import Login from "./components/login/Login"; // Includes Sign Up logic
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const [view, setView] = useState("login");
  // Tracks current view
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user);
      fetchUserInfo(user?.uid);

      // If the user is authenticated, set the view to 'list'
      if (user) {
        setView("list");
      } else {
        setView("login");
      }
    });

    return () => unSub();
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  const value = {
    messages,
    setMessages,
  };

  return (
    <div className="container">
      {view === "login" && <Login />}
      {view === "list" && (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      )}
      <Notification />
    </div>
  );
};

export default App;
