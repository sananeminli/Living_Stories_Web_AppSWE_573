import axios from "axios";
import { useState, useEffect } from "react";
import { StoryInt } from "../../Interfaces/StoryInt";
import { Button } from "react-bootstrap";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `http://localhost:8080/users/profile`,
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
      .post(`http://localhost:8080/users/follow/${id}`, null, { withCredentials: true })
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
      <Button onClick={handleClick}>{followed ? "Unfollow!" : "Follow"}</Button>
    </>
  );
}

export default FollowButton;
