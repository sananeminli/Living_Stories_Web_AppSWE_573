import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { StoryInt } from "../Interfaces/StoryInt";
import React from "react";
interface User {
  id: number;
  name: string;
  photo?: ArrayBuffer | null;
}


type Props = {
  type: "comment" | "story";
  id: number;
};

interface StoryPageProps {
  story: StoryInt;
}


function LikeButton({ type, id }: Props) {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState<User>();
  const [story , setStory] = useState<StoryPageProps>()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `http://localhost:8080/users/profile`,
          { withCredentials: true }
        );
        const response_story = await axios.get(`http://localhost:8080/stories/${id}`, {
        withCredentials: true,
      });
      setStory(response_story.data);


      setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  },[]);

  
  if(story?.story.likes.length!== 0 && story?.story.likes.includes(user?.id||0)){
    console.log(story?.story.likes)
    setLiked(true)
  }
  
  
  

  const handleClick = () => {
    const url =
      type === "comment"
        ? `http://localhost:8080/stories/comments/like/${id}`
        : `http://localhost:8080/stories/like/${id}`;

    axios
      .post(url, null, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setLiked(!liked);
        }
      })
      .catch((error) => {
        console.error("Error liking:", error);
      });
  };

  return (
    <Button onClick={handleClick}>
      {liked ? "Liked!" : "Like"}
    </Button>
  );
}

export default LikeButton;
