import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import Story from "./StoryCard";
interface User {
    id: number;
    name: string;
    photo?: ArrayBuffer | null;
  }
const NavBar: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>(
          `http://localhost:8080/users/profile`,
          { withCredentials: true }
        );
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  },[]);

  const navigate = useNavigate();
  const logout = async () => {
    const response = await axios.get("http://localhost:8080/logout", {
      withCredentials: true,
    });
    localStorage.clear();
    navigate("/");
  };

  return (
    <Navbar bg="primary" expand="lg" variant="dark" style={{fontFamily: 'HandWriting' , fontSize:"xx-large"}}>
      <Container>
        <Navbar.Brand href="/home" >Living Stories</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav  className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href={`/user/${user?.name}`}>{user?.name}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Button 
        onClick={() => {
          navigate("/story", { replace: true });
        }}
        style={{ minWidth:"fit-content",fontSize:"xx-large" }}
      >
        Create Story
      </Button>
      <Button onClick={logout} style={{ minWidth:"fit-content", fontSize:"xx-large" }}>Log Out</Button>
    </Navbar>
  );
};

export default NavBar;
