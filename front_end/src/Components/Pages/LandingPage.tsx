import { Image, Button} from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import {  Row, Container} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../CSS/background.css'

const LandingPage: React.FC = () => {
  const token = localStorage.getItem("jwt_Token");
    const navigate = useNavigate()
    return(
        <div className="background_gif" style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "-webkit-fill-available"  ,height: "100vh" }}>
        <Image src="./src/assets/images/logo_kare.png"  style={{ width:"70%" , height:"auto" ,marginTop:"50px"}} preview = {false} />
        <h3 style={{color:"white"}}> Welcome to Living Stories, the ultimate writing and memory-sharing app, where you can unleash your creativity and connect with others through the power of beautiful memories.</h3>
        
                <p style={{color:"white",margin:"10px"}}>If you don't have an account, register first!</p>
                <Button style={{margin:"10px"}} onClick={()=>{navigate("/register")}}>Register!</Button>
            
                
            
                <p style={{color:"white",margin:"10px"}}>If you have an account login!</p>
                <Button style={{margin:"10px"}} onClick={()=>{navigate("/login")}}>Log in!</Button>
           
        
        </div>
    )
}

export default LandingPage