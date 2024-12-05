import { useNavigate } from "react-router-dom";

const HomeButton = ({ children }) => {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate("/profile");
  };
  return (
    <div onClick={handleHomeClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export default HomeButton;