import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../Components/NavBar";
import StoryComponent from "../Components/StoryCard";

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
    text: string;
    user: {
      id: number;
      name: string;
    };
    likes: number[];
  }[];
  labels:string[]
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
  const navigate = useNavigate()
  
  const token = localStorage.getItem("jwt_Token");  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt_Token"))
      ?.split("=")[1];

    if (!cookieValue) {
      navigate("/login");
    }
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `${import.meta.env.VITE_BACKEND_URL}/profile`,
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
      <NavBar/>
      <h1>{user.name}'s stories</h1>
      <ul>
        {user.stories?.map((story) => (
          <li key={story.id}>
            <StoryComponent story={story}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
