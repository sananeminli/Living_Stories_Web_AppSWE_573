import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { StoryInt } from "../../Interfaces/StoryInt";
import React from "react";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `http://localhost:8080/users/profile`,
          { withCredentials: true }
        );
        const response_story = await axios.get<StoryInt>(
          `http://localhost:8080/stories/${id}`,
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
    } else if (type === "comment" && story?.comments?.find(c => c.id === id)?.likes?.includes(user?.id || 0)) {
      console.log(story.comments.find(c => c.id === id))
      setLiked(true);
    }
  };

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
          window.location.reload(); // Reload the page
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
