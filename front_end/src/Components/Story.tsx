import { Card, Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";

interface Story {
  id: number;

  header: string;
  user?: {
    id: number;
    name: string;
  };

  locations?: {
    id: number;
    lat: number;
    lng: number;
    name: string;
  }[];
  comments:{
    text:string;
    user: {
      id: number;
      name: string;
    };
    likes:number[]
  }[]
  startDate?: string;
  endDate?: string;
  likes: number[];
}

interface StoryProps {
  story: Story;
}

const StoryComponent: React.FC<StoryProps> = ({ story }) => {
  return (
    <><Link to={`/stories/${story.id}`} style={{ textDecoration: 'none' }}>
      <Card
        title={story.header}
        hoverable={true}
        extra={<a href={`/stories/${story.id}`}>Read The Story</a>}
      >
        <Row>
          {story.user?.name && (
            <Col xs={3}>
              {" "}
              <p>Author: {story.user.name}</p>
            </Col>
          )}
          <Col xs={6}>
            <p>Locations</p>{" "}
            {story.locations?.map((location) => (
              <p key={location.id}>{location.name}</p>
            ))}
          </Col>
          <Col>
            <p>Likes: {story.likes.length}</p>
            <p>Comments:{story.comments.length} </p>
          </Col>
              
          <Col>
          </Col>
        </Row>

        <p>{story.startDate}</p>
        <p>{story.endDate}</p>
      </Card></Link>
    </>
  );
};

export default StoryComponent;
