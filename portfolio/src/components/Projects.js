import React, { useState } from "react";

const projects = [ { id: 1, title: "Portfolio Website", description: "A personal portfolio showcasing my skills and projects.", tech: "React, Tailwind, JavaScript" }, { id: 2, title: "Weather App", description: "A real-time weather app using an API.", tech: "React, API, CSS" }, ];

export default function Projects() { const [expandedProject, setExpandedProject] = useState(null);

return (
   <section id="projects" className="section"> 
<h2>Projects</h2> 
{projects.map((project) => ( 
  <div key={project.id} className="project-card"> 
<h3>{project.title}</h3> 
<button onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}>
   {expandedProject === project.id ? "Hide Details" : "Show Details"} </button> {expandedProject === project.id && (
     <p>{project.description} (Tech Used: {project.tech})</p> )} </div> ))
     } 
</section> ); 
}