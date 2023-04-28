import React from 'react';
import { Link } from 'react-router-dom';


interface Story {
  id: number;
  text: string;
  header: string;
  user: {
    id: number;
    name: string;
  };
  likes: {
    id: number;
    user: {
      id: number;
    };
  }[];
}

interface StoryProps {
  story: Story;
}

const StoryComponent: React.FC<StoryProps> = ({ story }) => {
  return (
    <div>
      <h1>
        <Link to={`/stories/${story.id}`}>{story.header}</Link>
      </h1>
      <p>By: {story.user.name}</p>
      <p>Likes: {story.likes.length}</p>
      <p>{story.text}</p>
    </div>
  );
};

export default StoryComponent;
