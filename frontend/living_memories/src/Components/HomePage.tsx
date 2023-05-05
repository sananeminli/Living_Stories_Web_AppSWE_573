import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Story from './Story';
import axios from 'axios';


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
const HomePage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      const response = await axios.get<Story[]>('http://localhost:8080/stories', {
        withCredentials: true
      });
      setStories(response.data);
    };

    fetchStories();
  }, []);

  return (
    <div>
      <nav>

            <Link to="/story">Create New Story</Link>
            <Link to = "/edituser">Edit User</Link>
          
         
        
            <Link to="/about">Deneme</Link>
         
       
      </nav>
      <h1>Recent Stories</h1>
      <ul>
        {stories.map((story: Story) => (
          <li key={story.id}>
            <Story story={story} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
