import SignupForm from "../components/SignupForm";
import Lottie from "lottie-react"; // Import Lottie
import animationData from "../assets/lottie/Animation-taskManagement - 1731885778267.json";

const SignupPage = () => {
  return (
    <div className="flex h-screen bg-primary-700">
      {/* Left side: Animation */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-primary-700">
        <p className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl italic font-semibold ">
          TaskFlow
        </p>
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
