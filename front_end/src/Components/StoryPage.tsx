import { useEffect, useState } from "react";
import { useParams, Params } from "react-router-dom";
import { StoryInt } from "../Interfaces/StoryInt";
import axios from "axios";
import ReactQuill from "react-quill";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-quill/dist/quill.snow.css";
import { Col, Container, Row } from "react-bootstrap";
import RichTextPreview from "./RichTextPreview";
import NavBar from "./NavBar";

interface StoryPageProps {
  story: StoryInt;
}

interface RouteParams extends Params {
  id: string;
}

const StoryPage: React.FC<StoryPageProps> = ({ story }) => {
  return (
    <>
      <NavBar/>
      <Container>
        <Row>
          <h1>{story.header}</h1>
        </Row>
        <Row>
          <p>By: {story.user.name}</p>
        </Row>
        <Row>
          <Col xs={3}>
            <RichTextPreview content={story.richText} />
          </Col>
        </Row>
      </Container>

      <p>Likes: {story.likes.length}</p>
    </>
  );
};

const StoryPageContainer: React.FC = () => {
  const [story, setStory] = useState<StoryInt | null>(null);
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
