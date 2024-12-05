import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

const HomeButton = ({ children }: { children: ReactNode }) => {
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
