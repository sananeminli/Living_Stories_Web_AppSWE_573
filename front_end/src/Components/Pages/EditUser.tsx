import { Avatar, Button, Col, Input, Row, UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import Upload from "antd/es/upload/Upload";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";

interface EditUserData {
  biography?: string;
  photo?: string;
  
}

interface User {
  id: number;
  name: string;
  photo?: string;
  biography?: string;
}

const EditUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bio, setBio] = useState<string | undefined>(undefined);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `http://localhost:8080/users/profile`,
          { withCredentials: true }
        );
        setUser(response.data);
        setPhoto(response.data.photo)
        setBio(response.data.biography)
        console.log(response.data)
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUser();
  }, []);
  

  const handleSubmit = async () => {
    const editUserData: EditUserData = {
      photo,
      biography: bio
      
    };
    console.log(editUserData)

    try {
      const response = await axios.post(
        "http://localhost:8080/users/update",
        editUserData,
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    navigate("/home")
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(",")[1];
        console.log(base64String); // Base64-encoded string
        setPhoto(base64String);
      };
    }
  };
  const handleImageUpload = (info: UploadChangeParam<UploadFile<any>>) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result as string;
      setPhoto(imageDataUrl);
      console.log(photo);
    };
    reader.readAsDataURL(info.file.originFileObj as Blob);
  };
  
  

  return (
    <>
      <NavBar/>
      <h2>Edit Profile</h2>
      <Container>
        <Row>
          <Col sm={4}>
            <Row>
              {photo ? <Avatar size={150}  src={<img src={photo} alt="avatar" />}/> :<Avatar size={150}>{user?.name}</Avatar>}
              
            </Row>
            <Row>
              <Upload
                name="avatar"
                accept="image/*"
                showUploadList={false}
                onChange={handleImageUpload}
              >
                <Button icon={<UploadOutlined />} >Change Photo</Button>
              </Upload>
              
            </Row>
          </Col>
          <Col >
            <TextArea onChange={handleBioChange} value={bio} rows={8} />
          </Col>
        </Row>
        <Row>
          <Button onClick={handleSubmit}>Save</Button>
        </Row>
      </Container>
    </>
  );
};

export default EditUser;
