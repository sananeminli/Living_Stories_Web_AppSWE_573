import { FC, useEffect, useState } from "react";
import { useParams, Params } from "react-router-dom";
import { StoryInt } from "../Interfaces/StoryInt";
import axios from "axios";
import ReactQuill from "react-quill";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import NavBar from "./NavBar";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import LikeButton from "./LikeButton";

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

const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
  const StoryMarkers: React.FC<LocationProps> = ({ slocations }) => {
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
  };
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
        "http://localhost:8080/stories/comments",
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
          <h1>{story.header}</h1>
        </Row>
        <Row>
          <p>By: {story.user.name}</p>
        </Row>
        <Row>
          <Col xs={8}>
            <ReactQuill
              value={story.richText}
              readOnly={true}
              modules={{ toolbar: false }}
            />
            
          </Col>

          <Col xs={4}>
            <GoogleMap
              zoom={3}
              mapContainerStyle={containerStyle}
              center={mapCenter}
            >
              <StoryMarkers slocations={story.locations} />
            </GoogleMap>
          </Col>
        </Row>
        <p>Likes: {story.likes.length}</p>
      </Container>
      

      <Container>
        <Row>
          <Col xs={12}>
            <TextArea
              autoSize={true}
              placeholder="Write Comment!"
              onChange={handleCommentChange}
            ></TextArea>
          </Col>
          <Col xs={6}>
            <Button onClick={sendComment}> Add Comment</Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          {story.comments.map((comment, index) => (
            <div key={index}>
              <p>{comment.text}</p>
              <p>By: {comment.user.name}</p>
              <p>Likes: {comment.likes.length}</p>
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
      const response = await axios.get(`http://localhost:8080/stories/${id}`, {
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
