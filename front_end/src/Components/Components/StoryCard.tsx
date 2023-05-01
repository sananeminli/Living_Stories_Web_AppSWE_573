import { Badge, Card, Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";

interface Story {
  id: number;

  header: string;
  user?: {
    id: number;
    name: string;
  };
  labels:string[]

  locations?: {
    id: number;
    lat: number;
    lng: number;
    name: string;
  }[];
  comments: {
    text: string;
    user: {
      id: number;
      name: string;
    };
    likes: number[];
  }[];
  startDate?: string;
  endDate?: string;
  likes: number[];
}

interface StoryProps {
  story: Story;
}

const StoryComponent: React.FC<StoryProps> = ({ story }) => {
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
  
  
  
  return (
    <div
      onClick={() => {
        window.location.href = `/stories/${story.id}`;
      }}
      style={{ textDecoration: "none", cursor: "pointer" }}
    >
      <Badge.Ribbon  text={
        <div>
          {story.labels.map((label, index) => (
                  
                    <p key={index}>{label}</p>
                  
                ))}
        </div>
      } color={randomColor} >
      <Card
        title={story.header}
        hoverable={true}
        extra={
          <p>
            {" "}
            {story.startDate} {story.endDate}
          </p>
        }
        style={{ margin: "5px" }}
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

          <Col></Col>
        </Row>

        <p>{story.startDate}</p>
        <p>{story.endDate}</p>
      </Card>
      </Badge.Ribbon>
    </div>
  );
};

export default StoryComponent;
