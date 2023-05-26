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
          `${import.meta.env.VITE_BACKEND_URL}/users/getname`,
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
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      withCredentials: true,
    });
    localStorage.clear();
    navigate("/");
  };

  return (
    <Navbar  expand="lg" variant="dark" style={{fontFamily: 'HandWriting' , fontSize:"xx-large",backgroundColor: '#1F6C5C'}}>
      <Container>
        
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav  className="me-auto">
           
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href={`/user/${user?.name}`}>{user?.name}</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
        <Navbar.Brand href="/home" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <img
              src="../src/assets/images/logo_kare.png"
              width="270px"
              height="auto"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            /></Navbar.Brand>
      </Container>
      <Button variant='secondary'
        onClick={() => {
          navigate("/story", { replace: true });
        }}
        style={{ minWidth:"fit-content",fontSize:"xx-large" , backgroundColor: '#1F6C5C', outline:"none"}}
      >
        Create Story
      </Button>
      <Button variant='secondary' onClick={logout} style={{ minWidth:"fit-content", fontSize:"xx-large", backgroundColor: '#1F6C5C' }}>Log Out</Button>
    </Navbar>
  );
};

export default NavBar;
