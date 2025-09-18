/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

export default function GifWindow() {
  const gifs = [
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG00bTN4OHl0a3hjemRta2dwaDR6cW81MXQ3M2pqeTY5cXRobGEwNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/116n6kcHaFbw3e/giphy.gif", // Pixel art
    "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif", // Cute penguin
    "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif", // Typing cat
    "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", // Matrix code
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzZ2OWN3anVrdG1sNmtyd3VhYWcwdDdieHFjemg0N3JzaDBtM3FuNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JRlqKEzTDKci5JPcaL/giphy.gif",
  ];

  const [currentGif, setCurrentGif] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [currentGif]);

  const handleClick = () => {
    setCurrentGif((prev) => (prev + 1) % gifs.length);
  };

  return (
    <motion.div
      className="w-10 h-9 bg-gray-800 rounded cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
    >
      {isLoading && <Skeleton className="w-full h-full rounded" />}
      <img
        src={gifs[currentGif]}
        alt="OS Icon"
        className={`w-full h-full object-cover ${
          isLoading ? "hidden" : "block"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </motion.div>
  );
}
