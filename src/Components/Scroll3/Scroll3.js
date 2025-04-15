import React, { useEffect } from 'react';
import './Scroll3.css';

const Scroll3 = () => {
    useEffect(() => {
        // Clone the logos slide to create the infinite loop effect
        const logosSlide = document.querySelector('.logos-slide');
        const copy = logosSlide.cloneNode(true);
        document.querySelector('.logos').appendChild(copy);
      }, []);

  return (
    <div className="logos2">
    <div className="logos-slidee">
      <img src="A01.webp" alt="3M Logo" />
      <img src="A02.webp" alt="Barstool Store Logo" />
      <img src="A03.webp" alt="Budweiser Logo" />
      <img src="A04.webp" alt="Buzzfeed Logo" />
      <img src="A05.webp" alt="Forbes Logo" />
      <img src="A06.webp" alt="Macy's Logo" />
      <img src="A07.webp" alt="Men's Health Logo" />
      <img src="A08.webp" alt="MrBeast Logo" />
      <img src="A01.webp" alt="3M Logo" />
      <img src="A02.webp" alt="Barstool Store Logo" />
      <img src="A03.webp" alt="Budweiser Logo" />
      <img src="A04.webp" alt="Buzzfeed Logo" />
      <img src="A05.webp" alt="Forbes Logo" />
      <img src="A06.webp" alt="Macy's Logo" />
      <img src="A07.webp" alt="Men's Health Logo" />
      <img src="A08.webp" alt="MrBeast Logo" />
      <img src="A01.webp" alt="3M Logo" />
      <img src="A02.webp" alt="Barstool Store Logo" />
      <img src="A03.webp" alt="Budweiser Logo" />
      <img src="A04.webp" alt="Buzzfeed Logo" />
      <img src="A05.webp" alt="Forbes Logo" />
      <img src="A06.webp" alt="Macy's Logo" />
      <img src="A07.webp" alt="Men's Health Logo" />
      <img src="A08.webp" alt="MrBeast Logo" />
      <img src="A01.webp" alt="3M Logo" />
      <img src="A02.webp" alt="Barstool Store Logo" />
      <img src="A03.webp" alt="Budweiser Logo" />
      <img src="A04.webp" alt="Buzzfeed Logo" />
      <img src="A05.webp" alt="Forbes Logo" />
      <img src="A06.webp" alt="Macy's Logo" />
      <img src="A07.webp" alt="Men's Health Logo" />
      <img src="A08.webp" alt="MrBeast Logo" />
      <img src="A01.webp" alt="3M Logo" />
      <img src="A02.webp" alt="Barstool Store Logo" />
      <img src="A03.webp" alt="Budweiser Logo" />
      <img src="A04.webp" alt="Buzzfeed Logo" />
      <img src="A05.webp" alt="Forbes Logo" />
      <img src="A06.webp" alt="Macy's Logo" />
      <img src="A07.webp" alt="Men's Health Logo" />
      <img src="A08.webp" alt="MrBeast Logo" />
    </div>
  </div>
  );
};

export default Scroll3;
