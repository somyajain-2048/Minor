import Chatlist from "./chatlist/Chatlist";
import UserInfo from "./Userinfo/UserInfo";
import "./list.css";

const List = () =>{
	return(
		<div className="list">

     <UserInfo/>
		 <Chatlist/>

		</div>
	)
}

export default List;