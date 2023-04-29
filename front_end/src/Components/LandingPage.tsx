import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const token = localStorage.getItem("jwt_Token");
    const navigate = useNavigate()
    return(
        <Container>
            <Row xs = {3}>
                <Button onClick={()=>{navigate("/register")}}>Register</Button>
            </Row>
            <Row>
                
            </Row>
            <Row xs = {3}>
                <Button onClick={()=>{navigate("/login")}}>Log in!</Button>
            </Row>
        </Container>
    )
}

export default LandingPage