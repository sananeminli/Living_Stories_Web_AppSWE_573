import { Image, Button} from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import {  Row, Container} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../CSS/background.css'

const LandingPage: React.FC = () => {
  const token = localStorage.getItem("jwt_Token");
    const navigate = useNavigate()
    return(
        <div className="background_gif" style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "-webkit-fill-available" }}>
        <Image src="./src/assets/images/logo_kare.png" preview = {false} style={{ width: '40%', height: 'auto' }}/>
        
            
                <Button style={{margin:"10px"}} onClick={()=>{navigate("/register")}}>Register!</Button>
            
                
            
           
                <Button style={{margin:"10px"}} onClick={()=>{navigate("/login")}}>Log in!</Button>
           
        
        </div>
    )
}

export default LandingPage