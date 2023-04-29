import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from "react-bootstrap";
import axios from "axios";

const NavBar: React.FC = () => {
    
    const navigate = useNavigate()
    const logout = async () => {
        const response = await axios.get('http://localhost:8080/logout', { withCredentials: true });
    }

    return (
        <Navbar bg="primary" expand="lg" variant="dark">
            
          <Container>
            <Navbar.Brand href="/home">Living Stories</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="#link">Profile</Nav.Link>
                
              </Nav>
            </Navbar.Collapse>
          </Container>
          <Button onClick={()=>{
            navigate("/story" , {replace:true})
          }} style={{maxWidth:"100%"}}>Create Story</Button>
          <Button onClick={logout}>Log Out</Button>
        
        </Navbar>
      );
}

export default NavBar