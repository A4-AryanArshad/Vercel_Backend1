import React, { useEffect } from 'react';
import './Scroll.css';

const Scroll = () => {
    useEffect(() => {
        // Clone the logos slide to create the infinite loop effect
        const logosSlide = document.querySelector('.logos-slide');
        const copy = logosSlide.cloneNode(true);
        document.querySelector('.logos').appendChild(copy);
      }, []);

  return (
    <div className="logos">
    <div className="logos-slide">
      <img src="./logos/3m.svg" alt="3M Logo" />
      <img src="./logos/barstool-store.svg" alt="Barstool Store Logo" />
      <img src="./logos/budweiser.svg" alt="Budweiser Logo" />
      <img src="./logos/buzzfeed.svg" alt="Buzzfeed Logo" />
      <img src="./logos/forbes.svg" alt="Forbes Logo" />
      <img src="./logos/macys.svg" alt="Macy's Logo" />
      <img src="./logos/menshealth.svg" alt="Men's Health Logo" />
      <img src="./logos/mrbeast.svg" alt="MrBeast Logo" />
    </div>
  </div>
  );
};

export default Scroll;
