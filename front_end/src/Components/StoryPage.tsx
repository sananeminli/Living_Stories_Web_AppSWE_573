import { useEffect, useState } from 'react';
import { useParams, Params } from 'react-router-dom';
import { StoryInt } from '../Interfaces/StoryInt';
import axios from 'axios';

interface StoryPageProps {
  story: StoryInt;
}

interface RouteParams extends Params {
  id: string;
}

const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
  return (
    <div>
      <h1>{story.header}</h1>
      <p>By: {story.user.name}</p>
      <p>Likes: {story.likes.length}</p>
      <p>{story.text}</p>
    </div>
  );
};

const StoryPageContainer: React.FC = () => {
  const [story, setStory] = useState<StoryInt | null>(null);
  const { id } = useParams<RouteParams>();

  useEffect(() => {
    // Fetch story data from API using the ID parameter
    const fetchStory = async () => {
      const response = await axios.get(`http://localhost:8080/stories/${id}`);
      setStory(response.data);
    };

    fetchStory();
  }, [id]);

  if (!story) {
    return <div>Loading...</div>;
  }

  return <StoryPage story={story} />;
};

export default StoryPageContainer;
