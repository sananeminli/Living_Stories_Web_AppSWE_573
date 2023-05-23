import { Image, Button} from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import {  Row, Container} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const token = localStorage.getItem("jwt_Token");
    const navigate = useNavigate()
    return(
        <div style={{textAlignLast:"center"}}>
        <Image src="./src/assets/images/logo_kare.png" preview = {false} style={{ width: '50%', height: 'auto' }}/>
        <Container >
            <Row xs = {3} justify="center">
                <Button onClick={()=>{navigate("/register")}}>Register</Button>
            </Row>
            <Row>
                
            </Row>
            <Row xs = {3} style={{marginTop:"10px"}} >
                <Button onClick={()=>{navigate("/login")}}>Log in!</Button>
            </Row>
        </Container>
        </div>
    )
}

export default LandingPage