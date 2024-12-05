import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface HomeButtonProps {
  children: ReactNode;
}

const HomeButton = ({ children }: HomeButtonProps) => {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate("/");
  };
  return (
    <div onClick={handleHomeClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export default HomeButton;
