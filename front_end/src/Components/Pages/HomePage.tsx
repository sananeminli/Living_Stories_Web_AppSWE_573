import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import Story from '../Components/StoryCard';
import axios from 'axios';
import NavBar from '../Components/NavBar';
import { Radio, RadioChangeEvent, Row } from 'antd';
import { ConsoleSqlOutlined } from '@ant-design/icons';

type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "All", value: "all" },
  { label: "Followings", value: "followings" },
  

];


interface Story {
    id: number;
    text: string;
    header: string;
    user: {
      id: number;
      name: string;
    };
    labels:string[];
    likes: number[]
    comments:{
      text:string;
      user: {
        id: number;
        name: string;
      };
      likes:number[]
    }[]
  }
const HomePage: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("all");
  const nav = useNavigate()
  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt_Token"))
      ?.split("=")[1];

    if (!cookieValue) {
      nav("/login");
    }
  }, []);


  useEffect(() => {
    const fetchStories = async () => {
      const url =
      selectedOption === "all"
        ? `${import.meta.env.VITE_BACKEND_URL}/stories`
        : `${import.meta.env.VITE_BACKEND_URL}/stories/following`;

      const response = await axios.get<Story[]>(url, {
        withCredentials: true
      });
      setStories(response.data);
      console.log(response.data)
    };

    fetchStories();
  }, [selectedOption]);

  const onRadioChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <NavBar/>
      <h1 style={{ textAlign: "center" ,fontFamily: 'HandWriting' , marginTop:"40px", marginBottom:"30px" }}>Recent Stories</h1>
      <Row style={{justifyContent:"center"}}>
        <Radio.Group style={{margin:"5px"}}
                options={options}
                onChange={onRadioChange}
                value={selectedOption}
                optionType="button"
                buttonStyle="solid"
                
              /></Row>
      <ul style={{listStyle:"none" , marginRight:"10px"}}>
        {stories.slice().reverse().map((story: Story) => (
          <li key={story.id}>
            <Story story={story} />
          </li>
        ))}
      </ul>
      {stories.length===0 && <h2 style={{textAlignLast:"center"}}>Nothing to show!</h2>}
    </div>
  );
};

export default HomePage;
