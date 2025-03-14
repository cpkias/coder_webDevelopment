import { motion } from "framer-motion";
import LazyLoad from "react-lazy-load";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col items-center justify-center">
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to FitZone Gym
      </motion.h1>
      <p className="text-lg mt-2">Achieve your fitness goals with us</p>
      <button className="mt-6 py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        Join Now
      </button>
      <LazyLoad>
        <img src="/assets/gym-image.jpg" alt="Gym" className="w-full h-auto" />
      </LazyLoad>
    </div>
  );
}

export default Home;