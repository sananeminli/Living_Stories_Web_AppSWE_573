import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import { Card } from "antd";
import Avatar from "antd/es/avatar/avatar";
import { Col, Row } from "react-bootstrap";
import LikeButton from "./LikeButton";



interface Comment {
    
  
    id:number
    
      text: string;
      user: {
        id: number;
        name: string;
        photo?:string
      };
      likes: number[];
    
  }
  
  interface CommentProps {
    comment: Comment;
    storyId:number
  }




const CommentComponent: React.FC<CommentProps> = ({ comment, storyId }) => {
    return (
        <Card
          
          style={{ margin: "5px" }}
        >
          <Row>
            {comment.user?.name && (
              <Col xs={3}>
                {comment.user?.photo ? (
                  <Avatar
                    size={"large"}
                    src={<img src={comment.user.photo} alt="avatar" />}
                  />
                ) : (
                  <Avatar
                    style={{ backgroundColor: "#87d068" }}
                    size={"large"}
                    icon={<UserOutlined />}
                  ></Avatar>
                )}{" "}
                <p> {comment.user.name}</p>
              </Col>
            )}
            <Col>
            <p>{comment.text}</p>
            </Col>
          </Row>
          <Row>
          <p>Likes: {comment.likes.length}</p>
                <LikeButton type="comment" id={storyId} commentId={comment.id} />
          </Row>
        </Card>
    )}

    export default CommentComponent
      


        