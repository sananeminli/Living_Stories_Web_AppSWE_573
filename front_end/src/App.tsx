import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage";
import StoryCreate from "./Components/Pages/StoryCreate";
import StoryPage from "./Components/Pages/StoryPage";
//import LogOut from './Components/Logout';
import LoginPage from "./Components/Pages/LoginPage";
import RegisterUser from "./Components/Pages/RegisterUser";
import EditUser from "./Components/Pages/EditUser";
import Deneme from "./Components/Deneme";
import LandingPage from "./Components/Pages/LandingPage";
import { LoadScript, LoadScriptNext } from "@react-google-maps/api";
import ProfilePage from "./Components/Pages/ProfilePage";

const api_key = import.meta.env.VITE_GOOGLE_API_KEY;

const App = () => {
  return (
    <Router>
      <LoadScriptNext googleMapsApiKey={api_key} libraries={["places"]}>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/deneme" element={<Deneme />} />
          <Route path="/story" element={<StoryCreate />}></Route>
          <Route path="/stories/:id" element={<StoryPage />} />
          <Route path="/user/:name" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/edituser" element={<EditUser />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </LoadScriptNext>
    </Router>
  );
};

export default App;
