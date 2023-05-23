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
};

interface StoryPageProps {
  story: StoryInt;
}

function LikeButton({ type, id }: Props) {
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState<User>();
  const [story, setStory] = useState<StoryInt>();
  const icon = liked ? <LikeFilled /> : <LikeOutlined/>;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
          { withCredentials: true }
        );
        const response_story = await axios.get<StoryInt>(
          `${import.meta.env.VITE_BACKEND_URL}/stories/${id}`,
          { withCredentials: true }
        );
        setStory(response_story.data);
        setUser(response.data);
        checkLiked(response_story.data, response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const checkLiked = (story: StoryInt, user: User) => {
    console.log(story.comments.find(c => c.id === id))
    if (type === "story" && story?.likes?.length !== 0 && story?.likes.includes(user?.id || 0)) {
      setLiked(true);
    }  if (type === "comment" && story?.comments?.find(c => c.id === id)?.likes?.includes(user?.id || 0)) {
      console.log(story.comments.find(c => c.id === id))
      setLiked(true);
    }
  };

  const handleClick = () => {
    const url =
      type === "comment"
        ? `${import.meta.env.VITE_BACKEND_URL}/stories/comments/like/${id}`
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
