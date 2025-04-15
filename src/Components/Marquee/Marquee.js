import React from 'react'
import './Marquee.css';
import Scroll from '../Scroll/Scroll';
import Scroll2 from '../Scroll2/Scroll2';
import Scroll3 from '../Scroll3/Scroll3';
import Marquee2 from '../Marquee2/Marquee2';
import Scroll4 from '../Scroll4/Scroll4';
import Marquee3 from '../Marquee3/Merquee3';

const Marquee = () => {
  return (
    <>
    <Scroll/>
<div id="cen">
    <h1 id="one">ENTER </h1>
    <h1 id="two">THE </h1>
    <h1 id="three">NFT META MART</h1>
</div>
<div id="wrap2">
<div id="wrap">
<p>You got here just in time.</p>
<p id="opui">Enter the NFT MetaMart, a place where you can buy things through a traditional listing style or enjoy a new gamified experience. Discover a unique, modern, and social way to shop. You can even invite your friends to join the fun. Explore now!</p>
</div>
</div>
<Scroll2/>
<Marquee2/>
<Scroll3/>
<Scroll4/>
<Marquee3/>


</>
  )
}

export default Marquee