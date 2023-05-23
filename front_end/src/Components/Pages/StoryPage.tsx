import { FC, useEffect, useMemo, useState } from "react";
import { useParams, Params, Link } from "react-router-dom";
import { StoryInt } from "../../Interfaces/StoryInt";
import axios from "axios";
import ReactQuill from "react-quill";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import {  Col, Container, Row } from "react-bootstrap";
import NavBar from "../Components/NavBar";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Avatar, Input, Tag, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import LikeButton from "../Components/LikeButton";
import FollowButton from "../Components/Follow";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import MessageFilled from "@ant-design/icons/lib/icons/MessageFilled";
import CommentComponent from "../Components/CommentCard";

interface StoryPageProps {
  story: StoryInt;
}
const containerStyle = {
  width: "100%",
  height: "400px",
};

interface RouteParams extends Params {
  id: string;
}
interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface LocationProps {
  slocations: Location[];
}

interface CommentRequestInt {
  text: string;
  storyId: number;
}
interface User {
  id: number;
  name: string;
  photo?: ArrayBuffer | null;
}

const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
  
  const [mapKey, setMapKey] = useState(0);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response_user = await axios.get<User>(
        `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
        { withCredentials: true }
      );

      if (response_user.data.name === story.user.name) {
        setIsAuthor(true);
      }
      setMapKey((prev) => prev + 1);
    }
    fetchData();
  }, [story]);

  const slocations = story.locations;
  const StoryMarkers: React.FC<LocationProps> = useMemo(
    () =>
      ({ slocations }) => {
        console.log(slocations);
        const markers = slocations.map((location, index) => (
          <Marker
            key={index}
            position={{
              lat: location.lat,
              lng: location.lng,
            }}
          />
        ));

        return <>{markers}</>;
      },
    [slocations]
  );

  const [comment, setComment] = useState<string>(" ");

  const storyId = story.id;
  console.log(story);

  let latSum = 0;
  let lngSum = 0;

  // Loop through locations
  story.locations.forEach((loc) => {
    latSum += loc.lat;
    lngSum += loc.lng;
  });

  // Calculate average coordinates
  const latAvg = latSum / story.locations.length;
  const lngAvg = lngSum / story.locations.length;

  // Set map center
  const mapCenter = { lat: latAvg, lng: lngAvg };

  const handleCommentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setComment(event.target.value);
  };
  const RequestData: CommentRequestInt = {
    text: comment,
    storyId: storyId,
  };

  const sendComment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/stories/comments`,
        RequestData,
        {
          withCredentials: true,
        }
      );

      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    window.location.reload();
  };

  return (
    <>
      <NavBar />

      <Container>
        <Row>
          <Col>
            <h1
              style={{
                fontFamily: "HandWriting",
                fontSize: "xxx-large",
                marginTop: "10px",
              }}
            >
              {story.header}
            </h1>
          </Col>
          

          <Col>
            {story.labels && (
              <div>
                {story.labels.map((label, index) => (
                  <div
                    key={index}
                    style={{ display: "inline-block", marginLeft: "10px" }}
                  >
                    <Tag
                      color={"lime"}
                      style={{ margin: "10px", inlineSize: "x-large" }}
                    >
                      {label}
                    </Tag>
                  </div>
                ))}
              </div>
            )}
          </Col>
          <Col>
            <Row>
              <p>Start Date: {story.startDate}   {story.startSeason&& <p> Season: {story.startSeason}</p>}</p>
             
            </Row>
            {story.endDate !== null && (
              <Row>
                <p>End Date:{story.endDate}  {story.endSeason&& <p> Season: {story.endSeason}</p>}</p>
              </Row>
            )}
          </Col>
          
        

        </Row>
        <Row>
        </Row>
        {story.user?.name && (
              <Col xs={3}>
                {story.user?.photo ? (
                  <Avatar
                    size={60}
                    src={<img src={story.user.photo} alt="avatar" />}
                  />
                ) : (
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    size={60}
                    icon={<UserOutlined />}
                  ></Avatar>
                )}{" "}
                <Link to={`/user/${story.user.name}`}>
            <p>By: {story.user.name}</p>
          </Link>
              </Col>
            )}
        <Row>
          
          
          <Col>
          {isAuthor && (
        <Button type="primary" icon ={<EditFilled />}
          onClick={() => {
            navigate(`/stories/edit/${story.id}`);
          }}
        >
          Edit Story
        </Button>
      )}
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <ReactQuill
              value={story.richText}
              readOnly={true}
              modules={{ toolbar: false }}
            />
          </Col>

          {story.locations.length > 0 && (
            <Col xs={4}>
              <GoogleMap
                zoom={3}
                mapContainerStyle={containerStyle}
                center={mapCenter}
              >
                <StoryMarkers slocations={story.locations} />
              </GoogleMap>
            </Col>
          )}
        </Row>
        <Row>
          <Col xs= {1}>
          <LikeButton type="story" id={story.id} />
          </Col>
          <Col>
          <p>Likes: {story.likes.length}</p>
          </Col>
        
        
        </Row>
        
        
      </Container>

      <Container>
        <Row>
          <Col xs={10}>
            <TextArea
              autoSize={true}
              placeholder="Write a comment!"
              onChange={handleCommentChange}
            ></TextArea>
          </Col>
          <Col xs={2}>
            <Button type="primary" icon = {<MessageFilled />} onClick={sendComment}> Add Comment</Button>
          </Col>
        </Row>
      </Container>
      
      <Container>
        <Row>
          {story.comments &&
            story.comments.map((comment, index) => (
              <div key={index}>
                <CommentComponent comment={comment}/>
              </div>
            ))}
        </Row>
      </Container>
      
    </>
  );
};

const StoryPageContainer: React.FC = () => {
  const [story, setStory] = useState<StoryInt>();
  const { id } = useParams<RouteParams>();

  useEffect(() => {
    // Fetch story data from API using the ID parameter
    const fetchStory = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stories/${id}`, {
        withCredentials: true,
      });
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
