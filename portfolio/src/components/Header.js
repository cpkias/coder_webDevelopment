import React from "react"; 
import { Sun, Moon } from "lucide-react";

export default function Header({ darkMode, setDarkMode }) 
{ return ( 
<header className="header"> 
<h1 className="title">Welcome To My Portfolio</h1> 
<nav className="nav"> 
  <a href="#about">About</a> 
  <a href="#projects">Projects</a> 
  <a href="#contact">Contact</a> </nav> 
  <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}> 
    {darkMode ? <Sun /> : <Moon />} 
  </button> 
</header> 
); 
}