import SignupForm from "../components/SignupForm";
import Lottie from "lottie-react"; // Import Lottie
import animationData from "../assets/lottie/Animation-taskManagement - 1731885778267.json";

const SignupPage = () => {
  return (
    <div className="flex h-screen bg-primary-700">
      {/* Left side: Animation */}
      <div className="w-1/2 flex justify-center items-center bg-primary-700">
        <Lottie animationData={animationData} loop={true} className="w-3/4" />
      </div>

      {/* Right side: Signup Form */}
      <div className="w-1/2 flex justify-center items-center bg-white">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
