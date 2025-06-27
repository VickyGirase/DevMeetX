import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center flex-col mt-[10%]">
      <h1 className="font-semibold text-accent-focus text-xl ">Hey, Classy Devs</h1>
      <h1 className="font-bold text-4xl text-error mt-1">Do You Wanna Collaborate With The Developers !</h1>
      <h2 className="text-purple-400 mt-2 text-xl">Connect, Chat, Debug</h2>
      <button className="btn btn-outline btn-secondary mt-8 " onClick={handleClick}>
        Get Started
      </button>
    </div>
  );
};

export default GetStarted;
