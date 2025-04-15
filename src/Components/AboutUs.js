import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../Components/aboutus.css'; // Custom styles

const AboutUs = () => {

  // Function to add animation class when elements are in view
  const handleScroll = () => {
    const elements = document.querySelectorAll('.animate');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        el.classList.add('in-view');
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
   


      <div className="back animate">
    <div className="text">
        <h6>Boost Your NFTs with</h6>
        <h1>NFT META MART</h1>
    </div>
</div>




      <h1 style={{ fontSize: '35px', fontWeight: 'bold', fontFamily: 'cursive', fontStyle: "revert", color: 'black', marginTop: '50px', marginLeft: '20px' }}> What we Provide :</h1>
      <p style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'cursive', fontStyle: "revert", color: 'black', marginLeft: '20px' }}>
      As a leading NFT platform on Ethereum, we offer a secure and transparent marketplace. Discover unique digital assets, connect with creators, and build a valuable collection. Our platform ensures the authenticity and provenance of every NFT.
      </p>
      <div className='contain'>
        <div className='box b1 animate animate-left'>
          <img 
            src={require('../mission.jpg')} 
            alt="NFT Preview"
            style={{ height: '120px', width: '120px', borderRadius: '50%' }} 
          />
          <br></br>
          <h3>Our Mission</h3>
          <p>To inspire creativity and innovation through Technology and art.</p>
        </div>

        <div className='box b2 animate animate-right'>
          <img 
            src={require('../vision.jpg')} 
            alt="NFT Preview"
            style={{ height: '120px', width: '120px', borderRadius: '50%' }} 
          />
          <br></br>
          <h3>Our Vision</h3>
          <p>To be the leader in Digital art solutions, fostering a global community of creators.</p>
        </div>

        <div className='box b3 animate animate-left'>
          <img 
            src={require('../value.jpg')} 
            alt="NFT Preview"
            style={{ height: '120px', width: '120px', borderRadius: '50%' }} 
          />
          <br></br>
          <h3>Our Values</h3>
          <p>Creativity, Collaboration, and Community are at the heart of everything we do.</p>
        </div>
      </div>

      <h1 style={{textAlign: 'center', color: 'black', marginTop: '90px', fontFamily: 'inherit', fontStyle: 'oblique', fontWeight: 'bold'}}> Meet Our Team </h1>

      <div className='team'>
        <div className='diba d1 animate animate-left'>
          <img 
            src={require('../sohail_pic.jpg')} 
            alt="NFT Preview"
            style={{ height: '120px', width: '120px', borderRadius: '50%' }} 
          />
          <br></br>
          <h3>Sohail Shahid</h3>
          <p>CEO & Co-Founder</p>
          <p style={{fontSize: '11px', fontFamily: 'cursive'}}>Passionate about art and technology, Sohail leads with visionary ideas and creative strategies.</p>
        </div>

        <div className='diba d2 animate animate-right'>
          <img 
            src={require('../hammadali.jpg')} 
            alt="NFT Preview"
            style={{ height: '120px', width: '120px', borderRadius: '50%' }} 
          />
          <br></br>
          <h3>Hammad Ali</h3>
          <p>Co-Founder</p>
          <p style={{fontSize: '11px', fontFamily: 'cursive'}}>Hammad's expertise in technology drives the innovation, ensuring top-notch digital solutions.</p>
        </div>

        <div className='diba d3 animate animate-left'>
          <img 
            src={require('../aryan.jpg')} 
            alt="NFT Preview"
            style={{ height: '120px', width: '120px', borderRadius: '50%' }} 
          />
          <br></br>
          <h3>Aryan Arshad</h3>
          <p>Co-Founder</p>
          <p style={{fontSize: '11px', fontFamily: 'cursive'}}>Aryan's keen eye for design and aesthetics shapes the artistic direction of the company.</p>
        </div>
      </div>

<br>
</br>
<br>
</br>
<br>
</br>
      <Footer />
    </>
  );
};

export default AboutUs;
