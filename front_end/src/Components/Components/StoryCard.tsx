import { Avatar, Badge, Card, Col, Row } from "antd";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface Story {
  id: number;

  header: string;
  user?: {
    id: number;
    name: string;
    photo?: string;
  };
  labels: string[];

  locations?: {
    id: number;
    lat: number;
    lng: number;
    name: string;
    country?:string;
    city?:string

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
  decade?:string
}

interface StoryProps {
  story: Story;
}

const StoryComponent: React.FC<StoryProps> = ({ story }) => {
  return (
    <div
      onClick={() => {
        window.location.href = `/stories/${story.id}`;
      }}
      style={{ textDecoration: "none", cursor: "pointer" }}
    >
      <Badge.Ribbon
      placement="end"
        text={
          <div>
            {story.labels.map((label, index) => (
              <p key={index}>{label}</p>
            ))}
          </div>
        }
        color="lime"
      >
        <Card
          title={story.header}
          hoverable={true}
          style={{ margin: "5px" }}
        >
          <Row>
            {story.user?.name && (
              <Col xs={3}>
                {story.user?.photo ? (
                  <Avatar
                    size={"large"}
                    src={<img src={story.user.photo} alt="avatar" />}
                  />
                ) : (
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    size={"large"}
                    icon={<UserOutlined />}
                  ></Avatar>
                )}{" "}
                <p> {story.user.name}</p>
              </Col>
            )}
            <Col xs={6}>
              <p>Locations:</p>{" "}
              {story.locations?.map((location) => (
                <p key={location.id}>{location.city}/{location.country}</p>
              ))}
            </Col>
            <Col >
              <p style={{marginLeft:"10px"}}>Likes: {story.likes.length}</p>
              <p style={{marginLeft:"10px"}}>Comments:{story.comments.length} </p>
            </Col>

            {story.decade === undefined || story.decade === null && <Col style={{marginLeft:"10px"}}>
              <p >   {story.startDate} </p>
              <p>   {story.endDate}</p>
            </Col>}
            {story.decade!==null && <Col style={{marginLeft:"10px"}}>{story.decade}</Col>}
          </Row>
        </Card>
      </Badge.Ribbon>
    </div>
  );
};

export default StoryComponent;
