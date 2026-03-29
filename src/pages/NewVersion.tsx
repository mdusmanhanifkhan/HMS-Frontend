import React from 'react'
import launchGif from '../assets/images/hi.gif'
import '../App.css'
const NewVersion: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-dark)] text-[var(--color-white)]">
      <section>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </section>

      {/* Animated GIF */}
      <div className="mt-0 animate-bounce">
        <img src={launchGif} alt="Launch" className="w-64 h-64" />
      </div>

      {/* Main Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center animate-pulse text-[var(--color-red)]">
        🎉 Welcome to the New Version! 🎉
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-xl md:text-2xl text-center text-[var(--color-gray)] z-50">
        Experience the awesome new features and improvements!
      </p>

      {/* Button Link */}
      <a
        target="_blank"
        href="https://hikarimed-v2.vercel.app" // Replace with your link
        className="!mt-10 !px-8 !py-4 bg-[var(--color-red-100)] z-50 text-[var(--color-white)] font-bold rounded-full shadow-lg hover:bg-[var(--color-red)] transition transform hover:scale-105"
      >
        Explore Now
      </a>
    </div>
  )
}

export default NewVersion
