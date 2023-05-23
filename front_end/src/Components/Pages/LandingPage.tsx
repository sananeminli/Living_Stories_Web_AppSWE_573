import { Image, Button} from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import {  Row, Container} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../CSS/background.css'

const LandingPage: React.FC = () => {
  const token = localStorage.getItem("jwt_Token");
    const navigate = useNavigate()
    return(
        <div className="container" style={{textAlignLast:"center" , minWidth:"-webkit-fill-available"}}>
        <Image src="./src/assets/images/logo_kare.png" preview = {false} style={{ width: '50%', height: 'auto' }}/>
        
            <Row xs = {3} >
                <Button onClick={()=>{navigate("/register")}}>Register</Button>
            </Row>
            <Row>
                
            </Row>
            <Row xs = {3} style={{marginTop:"10px"}} >
                <Button onClick={()=>{navigate("/login")}}>Log in!</Button>
            </Row>
        
        </div>
    )
}

export default LandingPage