import { useEffect, useState } from "react";
import axios from "axios";

import { StoryInt } from "../../Interfaces/StoryInt";
import React from "react";
import { LikeFilled, LikeOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface User {
  id: number;
  name: string;
}

type Props = {
  type: "comment" | "story";
  id: number;
  commentId?:number
};

interface StoryPageProps {
  story: StoryInt;
}

function LikeButton({ type, id , commentId }: Props) {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState<User>();
  const [story, setStory] = useState<StoryInt>();
  const icon = liked ? <LikeFilled /> : <LikeOutlined/>;

  useEffect(() => {
    const fetchUser = async () => {
      const url =
      type === "comment"
        ? `${import.meta.env.VITE_BACKEND_URL}/stories/commentliked/${id}`
        : `${import.meta.env.VITE_BACKEND_URL}/stories/storyliked/${id}`;
      try {
        const response = await axios.get<string>(
         url,
          { withCredentials: true }
        );
        
        if(response.data==="yes"){
          setLiked(true)
        }
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  

  const handleClick = () => {
    const url =
      type === "comment"
        ? `${import.meta.env.VITE_BACKEND_URL}/stories/comments/like/${commentId}`
        : `${import.meta.env.VITE_BACKEND_URL}/stories/like/${id}`;

    axios
      .post(url, null, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setLiked(!liked);
          window.location.reload(); // Reload the page
        }
      })
      .catch((error) => {
        console.error("Error liking:", error);
      });
  };

  return (
    <Button onClick={handleClick} icon = {icon}>
      {liked ? "Liked!" : "Like"}
    </Button>
  );
}

export default LikeButton;
