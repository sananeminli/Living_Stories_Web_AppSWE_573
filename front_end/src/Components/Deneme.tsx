import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
const Deneme: React.FC = () => {
    const [imgs, setImgs] = useState<string | undefined>();

    const handleChnage = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    const data = new FileReader();
    data.addEventListener("load", () => {
        setImgs(data.result as string);
    });
    data.readAsDataURL(e.target.files![0]);
    };
    const navigate = useNavigate()
    function handleClick(){
      navigate('/register',{replace:true})
    }

    

    console.log(imgs);
    return (
        <div>
          <button onClick={handleClick}>yuru</button>
          <input type="file" onChange={handleChnage} />
          <br />
          
          <img src={imgs} height="200px" width="200px" />
        </div>
        
      );
    }


    export default Deneme