import axios from 'axios';
import { useState } from 'react';

interface EditFormData {
  password: string;
  repassword: string;
  bio: string;
}

const EditUser: React.FC = () => {
  const [formData, setFormData] = useState<EditFormData>({ password: '', repassword: '', bio: '' });
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.password !== formData.repassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      try {
        const response = await axios.post('http://localhost:8080/users/update', formData, { withCredentials: true });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: event.target.value });
  };

  const handleRepasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, repassword: event.target.value });
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, bio: event.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password">New Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handlePasswordChange} />
      </div>
      <div>
        <label htmlFor="repassword">Confirm New Password:</label>
        <input type="password" id="repassword" name="repassword" value={formData.repassword} onChange={handleRepasswordChange} />
      </div>
      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleBioChange} />
      </div>
      {passwordError && <p style={{ color: 'red' }}>Password should be same</p>}
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditUser;
