import AddUser from "./addUser/AddUser";
import "./chatlist.css";
import { useUserStore } from "../../../lib/userStore";
import { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
// import Chat from "../../chat/Chat";

const Chatlist = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser) {
      console.log("Current user is null");
      return;
    }

    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        const items = res.data()?.chats || [];
        const promises = items.map(async (item) => {
          try {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
            const user = userDocSnap.data();
            return { ...item, user };
          } catch (err) {
            console.error("Error fetching user data:", err);
            return { ...item, user: { username: "Unknown User", avatar: "" } };
          }
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => unSub();
  }, [currentUser]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    if (chatIndex !== -1) {
      userChats[chatIndex].isSeen = true;
      const userChatRef = doc(db, "userChats", currentUser.id);

      try {
        await updateDoc(userChatRef, { chats: userChats });
        changeChat(chat.chatId, chat.user);
      } catch (err) {
        console.error("Error updating chat:", err);
      }
    }
  };
  const filterdChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatlist">
      <div className="search">
        <div className="searchBar">
          <img src="/search.png" alt="Search" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt="Toggle Add Mode"
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {chats.length === 0 && <p>No chats available</p>}

      {filterdChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#994C00",
          }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : chat.user.avatar || "./avatar.png"
            }
            alt="Avatar"
          />
          <div className="texts">
            <span>
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default Chatlist;
