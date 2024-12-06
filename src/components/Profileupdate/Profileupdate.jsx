import React from "react";
import "./profileupdate.css";

const ProfileUpdate = () => {
  return (
    <div className="profile">
      <div className="profile-container">
        <form
          action="
			"
        >
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input type="file" id="avatar" accept=".png , .jpg ,.jpeg" hidden />
            <img src="/avatar.png" alt="update profile" />
            upload profile image
          </label>

          <input type="text" placeholder="Name" required />
          <textarea placeholder="Write profile bio" id=""></textarea>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};
