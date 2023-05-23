import Button from "antd/es/button";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Image from "antd/es/image";
import axios from "axios";
import { useState } from "react";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';


interface RegisterFormData {
  email: string;
  password: string;
  repassword: string;
  name: string;
}

const RegisterUser: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({ email: '', password: '', repassword: '', name: '' });
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    if (formData.password !== formData.repassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      // Send form data to backend
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, formData);
        console.log(response.data);
        navigate('/login',{replace: true})
        
      } catch (error) {
        console.error(error);
      }
      console.log(formData);
    }
  };
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: event.target.value });
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: event.target.value });
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: event.target.value });
  };

  const handleRepasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, repassword: event.target.value });
  };

  return (
    
    
      <div className="login-page" style={{textAlignLast:"center"}}>
        <img src="./src/assets/images/logo_kare.png"  style={{ width:"30%"  , height:"auto" }}/>
        <h1>Welcome to Living Stories!</h1>
        <Row style={{ justifyContent: "center", marginTop: "50px" }}>
          <Form
            name="control-ref"
            onFinish={handleSubmit}
            style={{ maxWidth: 600 }}
          >
            <Form.Item name="Email" label="Email" rules={[{ required: true }]}>
              <Input placeholder="Provide your email!" onChange={handleEmailChange} />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input  placeholder="Provide your name!" onChange={handleNameChange} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password
                placeholder="input password"
                onChange={handlePasswordChange}
              />
            </Form.Item>
            <Form.Item 
            name="repassword"
            label = "Repeat Password"
            rules={[
                                {
                                    required: true,
                                    message: "You must confirm your password.",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("The passwords do not match.")
                                        );
                                    },
                                }),
                            ]}>
              <Input.Password   placeholder="repeat password" onChange={handleRepasswordChange}/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </Row>
        <Link to="/login">If you have an account, go to the login!</Link>
      </div>
    );
  };
    
 

export default RegisterUser;
