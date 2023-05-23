import axios from "axios";
import { useState, useEffect } from "react";
import { StoryInt } from "../../Interfaces/StoryInt";
import { Button } from "antd";
import PlusCircleFilled from "@ant-design/icons/lib/icons/PlusCircleFilled";
import MinusCircleFilled from "@ant-design/icons/lib/icons/MinusCircleFilled";

interface User {
  id: number;
  name:string
}
type Props = {
    id:number ;
    followers?: User[];
};

function FollowButton({ followers, id }: Props) {
  const [followed, setFollowed] = useState(false);
  const [user, setUser] = useState<User>();
  const icon = followed ? <MinusCircleFilled /> : <PlusCircleFilled />;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
          { withCredentials: true }
        );
        const user = response.data;
        setUser(user);
        if (followers?.some((follower) => follower.id === user.id)) {
          setFollowed(true);
        } else {
          setFollowed(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUser();
  }, [followers]);
  

  const handleClick = () => {
    

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/follow/${id}`, null, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setFollowed(true);
          window.location.reload(); // Reload the page
        }
      })
      .catch((error) => {
        console.error("Error liking:", error);
      });
  };
    
  

  return (
    <>
      <Button onClick={handleClick}icon={icon}  type="primary">{followed ? "Unfollow!" : "Follow"}</Button>
    </>
  );
}

export default FollowButton;
