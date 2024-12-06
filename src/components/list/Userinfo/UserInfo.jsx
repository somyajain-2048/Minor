import "./Userinfo.css";
import { useUserStore } from "../../../lib/userStore";
const UserInfo = () => {
  const { currentUser } = useUserStore();
  return (
    <div className="userinfo">
      <div className="user">
        <img src={currentUser?.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser?.username}</h2>
      </div>

      <div className="icons">
        <img src="./edit.png" alt="" />
        <div className="sub-menu">
          <p>Edit Profile</p>
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
