import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const loginData: LoginFormData = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post('http://localhost:8080/login', loginData, { withCredentials: true });

      if (response.status === 200) {
        // Redirect or update the state based on successful login
        console.log('Login successful');
        navigate('/home')
      }
    } catch (error) {
      console.log(error)
    }
  };

  // ... (return code)


  
  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit">Login</button>
        
      </form>
    </div>
  );
};

export default LoginPage;
