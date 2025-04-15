import React, { useEffect } from 'react';
import './Scroll4.css';

const Scroll4 = () => {
    useEffect(() => {
        // Clone the logos slide to create the infinite loop effect
        const logosSlide = document.querySelector('.logos-slide');
        const copy = logosSlide.cloneNode(true);
        document.querySelector('.logos').appendChild(copy);
      }, []);

  return (
    <div className="logos2">
    <div className="logos-slidee">
      <img src="A08.webp" alt="3M Logo" />
      <img src="A09.webp" alt="Barstool Store Logo" />
      <img src="A10.webp" alt="Budweiser Logo" />
      <img src="A11.webp" alt="Buzzfeed Logo" />
      <img src="A12.webp" alt="Forbes Logo" />
      <img src="A13.webp" alt="Macy's Logo" />
      <img src="A14.webp" alt="Men's Health Logo" />
      <img src="A08.webp" alt="3M Logo" />
      <img src="A09.webp" alt="Barstool Store Logo" />
      <img src="A10.webp" alt="Budweiser Logo" />
      <img src="A11.webp" alt="Buzzfeed Logo" />
      <img src="A12.webp" alt="Forbes Logo" />
      <img src="A13.webp" alt="Macy's Logo" />
      <img src="A14.webp" alt="Men's Health Logo" />
      <img src="A08.webp" alt="3M Logo" />
      <img src="A09.webp" alt="Barstool Store Logo" />
      <img src="A10.webp" alt="Budweiser Logo" />
      <img src="A11.webp" alt="Buzzfeed Logo" />
      <img src="A12.webp" alt="Forbes Logo" />
      <img src="A13.webp" alt="Macy's Logo" />
      <img src="A14.webp" alt="Men's Health Logo" />
      <img src="A08.webp" alt="3M Logo" />
      <img src="A09.webp" alt="Barstool Store Logo" />
      <img src="A10.webp" alt="Budweiser Logo" />
      <img src="A11.webp" alt="Buzzfeed Logo" />
      <img src="A12.webp" alt="Forbes Logo" />
      <img src="A13.webp" alt="Macy's Logo" />
      <img src="A14.webp" alt="Men's Health Logo" />
  

    </div>
  </div>
  );
};

export default Scroll4;
