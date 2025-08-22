import React from "react";
import { motion } from "framer-motion";
import HeroImage from "../assets/Hero1.png";

const Hero = () => {
  return (
    <motion.section
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5, ease: "easeOut" }}
    >
      <motion.div
        className="w-full h-screen flex items-center justify-center relative"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut", delay: 0.6 }}
      >
        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/30 z-10" />

        <img
          src={HeroImage}
          alt="Car Marketplace Hero"
          className="w-full h-full object-cover object-center relative z-0"
        />
      </motion.div>
    </motion.section>
  );
};

export default Hero;
