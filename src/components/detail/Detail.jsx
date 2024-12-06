import "./detail.css";
import { auth } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, updateDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log("Error while blocking user:", err);
    }
  };

  // Prevent rendering when `user` is not available
  if (!user) {
    return <div className="detail">Loading user details...</div>;
  }

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="User Avatar" />
        <h2>{user.username || "Unknown User"}</h2>
        <p>Hey there! I am using Chat App</p>
      </div>

      <div className="info">
        {/* <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="Toggle" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="Toggle" />
          </div>
        </div> */}

        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowUp.png" alt="Toggle" />
          </div>

          <div className="photos">
            {[...Array(3)].map((_, idx) => (
              <div className="photoItem" key={idx}>
                <div className="photoDetails">
                  <img
                    src="https://i.pinimg.com/236x/76/d0/26/76d0264c93a41f4a018309406ecd7050.jpg"
                    alt="Shared"
                  />
                  <span>Photo.png</span>
                </div>
                <img src="./download.png" className="icon" alt="Download" />
              </div>
            ))}
          </div>
        </div>

        {/* <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User Blocked"
            : "Block User"}
        </button> */}
        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
