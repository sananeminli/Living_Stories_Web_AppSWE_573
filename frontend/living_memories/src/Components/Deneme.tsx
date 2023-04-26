import { ChangeEvent, useState } from "react";

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

    console.log(imgs);
    return (
        <div>
          <input type="file" onChange={handleChnage} />
          <br />
          <img src={imgs} height="200px" width="200px" />
        </div>
      );
    }


    export default Deneme