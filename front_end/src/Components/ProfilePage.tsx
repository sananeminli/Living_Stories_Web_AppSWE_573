import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Story {
  id: number;
  header: string;
  likes: number[];
  locations?: {
    id: number;
    lat: number;
    lng: number;
    name: string;
  }[];
  startDate: string;
  endDate?: string;
}

interface User {
  id: number;
  name: string;
  photo?: ArrayBuffer | null;
  biography?: string | null;
  stories?: Story[];
  comments?: Comment[];
  followers?: User[];
  following?: User[];
}

interface RouteParams {
  name: string;
  [key: string]: string | undefined;
}

const ProfilePage: React.FC = () => {
  const { name } = useParams<RouteParams>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `http://localhost:8080/users/${name}`,
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [name]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.name}'s stories</h1>
      <ul>
        {user.stories?.map((story) => (
          <li key={story.id}>
            <h2>{story.header}</h2>
            <p>{story.startDate}</p>
            <p>{story.endDate}</p>
            {story.locations?.map((location) => (
              <p key={location.id}>
                {location.name} ({location.lat}, {location.lng})
              </p>
            ))}
            <p>Likes: {story.likes.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
