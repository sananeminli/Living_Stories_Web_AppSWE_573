import axios from "axios";
import { useState } from "react";
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
    event.preventDefault();
    if (formData.password !== formData.repassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      // Send form data to backend
      try {
        const response = await axios.post('http://localhost:8080/users', formData);
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleEmailChange} />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handlePasswordChange} />
      </div>
      <div>
        <label htmlFor="repassword">Confirm Password:</label>
        <input type="password" id="repassword" name="repassword" value={formData.repassword} onChange={handleRepasswordChange} />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleNameChange} />
      </div>
      {passwordError && <p style={{ color: 'red' }}>Password should be same</p>}
      
      <button type="submit">Submit</button>
        
    </form>
  );
};

export default RegisterUser;
