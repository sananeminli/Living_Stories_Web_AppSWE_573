import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
;


import HomePage from './Components/HomePage';
import StoryCreate from './Components/StoryCreate';
import StoryPage from './Components/StoryPage';
//import LogOut from './Components/Logout';
import LoginPage from './Components/LoginPage';
import RegisterUser from './Components/RegisterUser';
import EditUser from './Components/EditUser';
import Deneme from './Components/Deneme';
import { LoadScript } from '@react-google-maps/api';

const api_key = import.meta.env.GOOGLE_API_KEY


const App = () => {
  
  return (
    
    <Router>
      <LoadScript googleMapsApiKey= {api_key} libraries={["places"]}>
      <Routes>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/deneme" element={<Deneme/>} />
        <Route path='/story' element = {<StoryCreate/>}></Route>
        <Route path="/stories/:id" element = {<StoryPage/>} />
        <Route path='/login' element = {<LoginPage/>}/>
        <Route path='/register' element = {<RegisterUser/>}/>
        <Route path='/edituser' element  = {<EditUser/>}/>
      </Routes>
      </LoadScript>
    </Router>
    
  );
};

export default App;
