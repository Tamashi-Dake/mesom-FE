import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <BiArrowBack
      onClick={() => navigate(-1)}
      size={20}
      className="cursor-pointer hover:opacity-80 transition-all"
    />
  );
};

export default BackButton;
