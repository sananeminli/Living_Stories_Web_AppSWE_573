import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Row } from "antd";
import '../CSS/background.css'

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: any) => {
    const loginData: LoginFormData = {
      email: event.Email,
      password: event.Password,
    };

  

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        loginData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Redirect or update the state based on successful login
        console.log("Login successful");
        navigate("/home");
      }
      
    } catch (error) {
      alert("Wrong email or password provided! Try again!")
      console.log(error);
    }
  };

  // ... (return code)

  return (
    <div className="background_gif" style={{minWidth:"-webkit-fill-available"}}>
      <img src="./src/assets/images/plate.png"  style={{ width:"28%" , height:"auto" }}/>
      <Row style={{ justifyContent: "center", marginTop: "50px" }}>
        <Form
          name="control-ref"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="Email" label="Email" rules={[{ required: true }]}>
            <Input placeholder="write email" onChange={handleChange} />
          </Form.Item>
          <Form.Item
            name="Password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password
              placeholder="write password"
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Row>
      <Link to = "/register">If you don't have an account, go to the register!</Link>

    </div>
  );
};

export default LoginPage;
