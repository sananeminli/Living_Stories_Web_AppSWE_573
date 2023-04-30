import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StoryComponent from "./Story";
import NavBar from "./NavBar";
import { Button } from "react-bootstrap";

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
  comments:{
    text:string;
    user: {
      id: number;
      name: string;
    };
    likes:number[]
  }[]
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
  const [isAuthor, setIsAuthor] = useState<boolean>(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `http://localhost:8080/users/${name}`,
          { withCredentials: true }
        );
        const response_user = await axios.get<User>(
          `http://localhost:8080/users/profile`,
          { withCredentials: true }
        );
        setUser(response.data);
        if(response_user.data.name===name){setIsAuthor(true)}
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
      <NavBar/>
      
      <h1>{user.name}'s stories</h1>
      {isAuthor&&<Button>Edit</Button>}
      <ul>
        {user.stories?.map((story) => (
          <li style={{listStyle:"none"}} key={story.id}>
            <StoryComponent story={story}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
