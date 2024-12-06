import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload"; // Import the new upload function

const Chat = () => {
  const [chat, setChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({ file: null, url: "" });
  const [progress, setProgress] = useState(0);

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const endRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Fetch chat data in real-time
  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (snapshot) => {
      setChat(snapshot.data());
    });

    return () => unSub();
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !img.file) {
      console.warn("Message must have text or an image.");
      return;
    }

    let imgUrl = null;

    try {
      // Upload the image if present
      if (img.file) {
        console.log("Uploading image...");
        const uploadedUrl = await upload(img.file, setProgress);
        imgUrl = uploadedUrl;
        console.log("Image uploaded:", imgUrl);
      }

      // Construct the message
      const message = {
        senderId: currentUser.id,
        text: text.trim(),
        createdAt: Date.now(),
        ...(imgUrl && { img: imgUrl }),
      };

      console.log("Sending message:", message);

      // Update the chat in Firestore
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(message),
      });

      console.log("Message sent.");
    } catch (err) {
      console.error("Error sending message:", err);
    }

    // Reset the input fields
    setImg({ file: null, url: "" });
    setText("");
    setProgress(0);
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} />
          <div className="texts">
            <span>{currentUser?.name || "User"}</span>
            <p>{user?.status || "Online"}</p>
          </div>
        </div>
        <div className="icons">
          {/* <img src="/phone.png" alt="Phone" /> */}
          {/* <img src="/video.png" alt="Video" /> */}
          {/* <img src="/info.png" alt="Info" /> */}
        </div>
      </div>

      <div className="center">
        {chat?.messages
          ?.slice()
          .sort((a, b) => {
            const timeA = a.createdAt ? a.createdAt.seconds : 0;
            const timeB = b.createdAt ? b.createdAt.seconds : 0;
            return timeA - timeB;
          })
          .map((message, index) => (
            <div
              className={`message ${
                message.senderId === currentUser.id ? "own" : "message"
              }`}
              key={index}
            >
              <div className="texts">
                {message.img && <img src={message.img} alt="Message" />}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="Preview" />
              <button onClick={() => setImg({ file: null, url: "" })}>
                Remove
              </button>
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        {progress > 0 && progress < 100 && (
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }}></div>
          </div>
        )}

        <div className="icons">
          <label htmlFor="file">
            <img src="/img.png" alt="Upload" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="/camera.png" alt="Camera" />
          {/* <img src="/mic.png" alt="Mic" /> */}
        </div>

        <input
          type="text"
          placeholder={"Type a message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

        <div className="emoji">
          <img
            src="/emoji.png"
            alt="Emoji"
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>

        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

// import "./chat.css";
// import EmojiPicker from "emoji-picker-react";
// import {
//   arrayUnion,
//   onSnapshot,
//   updateDoc,
//   serverTimestamp,
//   doc,
// } from "firebase/firestore";
// import { useState, useRef, useEffect } from "react";
// import { db } from "../../lib/firebase";
// import { useChatStore } from "../../lib/chatStore";
// import { useUserStore } from "../../lib/userStore";
// import upload from "../../lib/upload"; // Import the new upload function

// const Chat = () => {
//   const [chat, setChat] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [text, setText] = useState("");
//   const [img, setImg] = useState({ file: null, url: "" });
//   const [progress, setProgress] = useState(0);
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
//     useChatStore();
//   const { currentUser } = useUserStore();
//   const endRef = useRef(null);

//   // Scroll to the latest message
//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat?.messages]);

//   // Fetch chat data in real-time
//   useEffect(() => {
//     if (!chatId) return;

//     const unSub = onSnapshot(doc(db, "chats", chatId), (snapshot) => {
//       setChat(snapshot.data());
//     });

//     return () => unSub();
//   }, [chatId]);

//   const handleEmoji = (e) => {
//     setText((prev) => prev + e.emoji);
//     setOpen(false);
//   };

//   const handleImg = (e) => {
//     if (e.target.files[0]) {
//       setImg({
//         file: e.target.files[0],
//         url: URL.createObjectURL(e.target.files[0]),
//       });
//     }
//   };

//   const openCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         setIsCameraOpen(true);
//       }
//     } catch (error) {
//       console.error("Error accessing the camera:", error);
//     }
//   };

//   const closeCamera = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject;
//       const tracks = stream.getTracks();
//       tracks.forEach((track) => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setIsCameraOpen(false);
//   };

//   const capturePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;

//     if (canvas && video) {
//       const context = canvas.getContext("2d");
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const image = canvas.toDataURL("image/png");
//       setCapturedImage(image);
//       closeCamera();
//     }
//   };

//   const handleSend = async () => {
//     if (!text.trim() && !img.file && !capturedImage) {
//       console.warn("Message must have text, an image, or a captured photo.");
//       return;
//     }

//     let imgUrl = null;

//     try {
//       // Upload the image if present
//       if (img.file || capturedImage) {
//         console.log("Uploading image...");
//         const imageFile = img.file
//           ? img.file
//           : await fetch(capturedImage).then((res) => res.blob());
//         const uploadedUrl = await upload(imageFile, setProgress);
//         imgUrl = uploadedUrl;
//         console.log("Image uploaded:", imgUrl);
//       }

//       // Construct the message
//       const message = {
//         senderId: currentUser.id,
//         text: text.trim(),
//         createdAt: Date.now(),
//         ...(imgUrl && { img: imgUrl }),
//       };

//       console.log("Sending message:", message);

//       // Update the chat in Firestore
//       await updateDoc(doc(db, "chats", chatId), {
//         messages: arrayUnion(message),
//       });

//       console.log("Message sent.");
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }

//     // Reset the input fields
//     setImg({ file: null, url: "" });
//     setCapturedImage(null);
//     setText("");
//     setProgress(0);
//   };

//   return (
//     <div className="chat">
//       {/* Existing chat code */}
//       <div className="bottom">
//         {/* Progress bar */}
//         {progress > 0 && progress < 100 && (
//           <div className="progress-bar">
//             <div style={{ width: `${progress}%` }}></div>
//           </div>
//         )}

//         <div className="icons">
//           {/* Camera Icon */}
//           <img src="/camera.png" alt="Camera" onClick={openCamera} />
//           <label htmlFor="file">
//             <img src="/img.png" alt="Upload" />
//           </label>
//           <input
//             type="file"
//             id="file"
//             style={{ display: "none" }}
//             onChange={handleImg}
//           />
//         </div>

//         {isCameraOpen && (
//           <div className="camera-preview">
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               style={{ width: "100%" }}
//             />
//             <canvas
//               ref={canvasRef}
//               style={{ display: "none" }}
//               width={640}
//               height={480}
//             ></canvas>
//             <button onClick={capturePhoto}>Capture</button>
//             <button onClick={closeCamera}>Close Camera</button>
//           </div>
//         )}

//         {/* Existing input and send button */}
//         <input
//           type="text"
//           placeholder={
//             isCurrentUserBlocked || isReceiverBlocked
//               ? "You Cannot send a message"
//               : "Type a message..."
//           }
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           disabled={isCurrentUserBlocked || isReceiverBlocked}
//         />

//         <button
//           className="sendButton"
//           onClick={handleSend}
//           disabled={isCurrentUserBlocked || isReceiverBlocked}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;
