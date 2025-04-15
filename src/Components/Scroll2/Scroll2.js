import React, { useEffect } from 'react';
import './Scroll2.css';

const Scroll2 = () => {
    useEffect(() => {
        // Clone the logos slide to create the infinite loop effect
        const logosSlide = document.querySelector('.logos-slide');
        const copy = logosSlide.cloneNode(true);
        document.querySelector('.logos').appendChild(copy);
      }, []);

  return (
    <div id="par">
    <div className="logoss">
    <div className="logos-slidee">
      <img src="./logos/001.webp" alt="3M Logo" />
      <img src="./logos/002.webp" alt="Barstool Store Logo" />
      <img src="./logos/003.webp" alt="Budweiser Logo" />
      <img src="./logos/004.webp" alt="Buzzfeed Logo" />
      <img src="./logos/005.webp" alt="Forbes Logo" />
      <img src="./logos/006.webp" alt="Macy's Logo" />
      <img src="./logos/007.webp" alt="Men's Health Logo" />
      <img src="./logos/008.webp" alt="MrBeast Logo" />
      <img src="./logos/001.webp" alt="3M Logo" />
      <img src="./logos/002.webp" alt="Barstool Store Logo" />
      <img src="./logos/003.webp" alt="Budweiser Logo" />
      <img src="./logos/004.webp" alt="Buzzfeed Logo" />
      <img src="./logos/005.webp" alt="Forbes Logo" />
      <img src="./logos/006.webp" alt="Macy's Logo" />
      <img src="./logos/007.webp" alt="Men's Health Logo" />
      <img src="./logos/008.webp" alt="MrBeast Logo" />
      <img src="./logos/001.webp" alt="3M Logo" />
      <img src="./logos/002.webp" alt="Barstool Store Logo" />
      <img src="./logos/003.webp" alt="Budweiser Logo" />
      <img src="./logos/004.webp" alt="Buzzfeed Logo" />
      <img src="./logos/005.webp" alt="Forbes Logo" />
      <img src="./logos/006.webp" alt="Macy's Logo" />
      <img src="./logos/007.webp" alt="Men's Health Logo" />
      <img src="./logos/008.webp" alt="MrBeast Logo" />
      <img src="./logos/001.webp" alt="3M Logo" />
      <img src="./logos/002.webp" alt="Barstool Store Logo" />
      <img src="./logos/003.webp" alt="Budweiser Logo" />
      <img src="./logos/004.webp" alt="Buzzfeed Logo" />
      <img src="./logos/005.webp" alt="Forbes Logo" />
      <img src="./logos/006.webp" alt="Macy's Logo" />
      <img src="./logos/007.webp" alt="Men's Health Logo" />
      <img src="./logos/008.webp" alt="MrBeast Logo" />
    </div>
  </div>
  </div>
  );
};

export default Scroll2;
