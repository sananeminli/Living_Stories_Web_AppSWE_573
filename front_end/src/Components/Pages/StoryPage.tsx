import { FC, useEffect, useMemo, useState } from "react";
import { useParams, Params } from "react-router-dom";
import { StoryInt } from "../../Interfaces/StoryInt";
import axios from "axios";
import ReactQuill from "react-quill";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import NavBar from "../Components/NavBar";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Input, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";
import LikeButton from "../Components/LikeButton";
import FollowButton from "../Components/Follow";

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
  const colors: string[] = [
    'pink',
    'red',
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'magenta',
    'volcano',
    'gold',
    'lime',
  ];
  
  // Get a random color from the array
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const [mapKey, setMapKey] = useState(0);
  const [isAuthor, setIsAuthor] = useState<boolean>(false)
  const navigate  = useNavigate()
  

  useEffect(() => {
    async function fetchData() {
      const response_user = await axios.get<User>(
        `http://localhost:8080/users/profile`,
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
                    <Tag color={randomColor}  style={{ margin:"10px" , inlineSize:"x-large" }}>
                      {label}
                    </Tag>
                  </div>
                ))}
              </div>
            )}
          </Col>
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
        <p>Likes: {story.likes.length}</p>
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
            <Button onClick={sendComment}> Add Comment</Button>
          </Col>
        </Row>
      </Container>
      {isAuthor&& <Button onClick={()=>{navigate(`/stories/edit/${story.id}`)}}>Edit Story</Button>}
      <Container>
        <Row>
          {story.comments &&
            story.comments.map((comment, index) => (
              <div key={index}>
                <p>{comment.text}</p>
                <p>By: {comment.user.name}</p>
                <p>Likes: {comment.likes.length}</p>
                <LikeButton type="comment" id={comment.id}/>
              </div>
            ))}
        </Row>
      </Container>
      <LikeButton type="story" id={story.id}/>
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
