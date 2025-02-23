import React, { useState, useEffect } from "react"; 
import Header from "./components/Header"; 
import About from "./components/About"; 
import Projects from "./components/Projects"; 
import Contact from "./components/Contact"; 
import "./App.css";
export default function Portfolio() { const [darkMode, setDarkMode] = useState(false);

useEffect(() => { const savedTheme = localStorage.getItem("darkMode"); if (savedTheme) setDarkMode(JSON.parse(savedTheme)); }, []);

useEffect(() => { localStorage.setItem("darkMode", JSON.stringify(darkMode)); }, [darkMode]);

return ( 
<div className={darkMode ? "dark" : "light"}> <Header darkMode={darkMode} setDarkMode={setDarkMode} /> 
<About /> 
<Projects /> 
<Contact /> 
</div> ); 
}
