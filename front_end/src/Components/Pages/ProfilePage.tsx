import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StoryComponent from "../Components/StoryCard";
import NavBar from "../Components/NavBar";

import { useNavigate } from "react-router-dom";
import { Avatar, Card, Col, Row ,Button} from "antd";
import FollowButton from "../Components/Follow";

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
  labels: string[];
  startDate: string;
  endDate?: string;
  comments: {
    text: string;
    user: {
      id: number;
      name: string;
    };
    likes: number[];
  }[];
}

interface User {
  id: number;
  name: string;
  photo?: string | null;
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
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `${import.meta.env.VITE_BACKEND_URL}/users/${name}`,
          { withCredentials: true }
        );
        const response_user = await axios.get<User>(
          `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
          { withCredentials: true }
        );
        setUser(response.data);
        if (response_user.data.name === name) {
          setIsAuthor(true);
        }
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
      <NavBar />
      <Card title="Profile Page">
        <Row>
          <Col>
            {user.photo ? (
              <Avatar size={150} src={<img src={user.photo} alt="avatar" />} />
            ) : (
              <Avatar size={150}>{user?.name}</Avatar>
            )}
          </Col>
          <Col>
            <p style={{marginLeft:"50px"}}>{user.biography}</p>
          </Col>
        </Row>
        <Row>
          <h3>{user.name}</h3>
        </Row>
        {isAuthor ? (
          <Button
            onClick={() => {
              navigate("/edituser");
            }}
          >
            Edit Profile
          </Button>
        ) : (
          <FollowButton followers={user.followers} id={user.id} />
        )}
      </Card>
      <Row>
        <h2>{user.name}'s Stories </h2>
      </Row>
      <ul>
        {user.stories?.map((story) => (
          <li style={{ listStyle: "none" }} key={story.id}>
            <StoryComponent story={story} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
