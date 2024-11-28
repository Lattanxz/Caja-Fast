import Navbar from "./components/Navbar";
import Body from "./components/Body";
import StateBar from "./components/StateBar";
import Information from "./components/Information";
import BottomBar from "./components/BottomBar";
import AuthForm from "./components/AuthForm";
import ProfileForm from "./components/ProfileForm";
import BoxesForm from "./components/BoxesForm";
import AdminForm from "./components/AdminForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div className="relative bg-bodyImage bg-cover bg-center h-[90vh] w-screen mx-auto pt-4">
                <div className="absolute inset-0 bg-white opacity-60"></div>
                <Body />
              </div>
              <StateBar />
              <Information />
              <BottomBar />
            </>
          }
        />

        <Route path="/auth" element={<AuthForm />} />

        <Route path="/boxes" element={<BoxesForm />} />

        <Route path="/users" element={<AdminForm />} />

        <Route path="/profile" element={<ProfileForm />} />
      </Routes>
    </Router>
  );
}

export default App;
