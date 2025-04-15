import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import Footer from '../Footer/Footer';
import Marquee from '../Marquee/Marquee';
import Collection from '../Collection';

const NavbarCarousel = () => {
    const [sliderItems, setSliderItems] = useState([
        { src: "image/01.png", author: "", title: "NFT META", topic: "MART", description: "Welcome to NFT MetaMart, where digital assets meet physical reality. Explore our collection of unique NFTs available for purchase online or through our immersive virtual store. Redefine how you shop and own the future!" },
        { src: "image/05.jpeg", author: "", title: "NFT META", topic: "MART", description: "Welcome to NFT MetaMart, where digital assets meet physical reality. Explore our collection of unique NFTs available for purchase online or through our immersive virtual store. Redefine how you shop and own the future!" },
        { src: "image/0010.png", author: "", title: "NFT META", topic: "MART", description: "Welcome to NFT MetaMart, where digital assets meet physical reality. Explore our collection of unique NFTs available for purchase online or through our immersive virtual store. Redefine how you shop and own the future!" },
        { src: "image/08.jpeg", author: "", title: "NFT META", topic: "MART", description: "Welcome to NFT MetaMart, where digital assets meet physical reality. Explore our collection of unique NFTs available for purchase online or through our immersive virtual store. Redefine how you shop and own the future!" },
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [walletAddress, setWalletAddress] = useState(""); // To store wallet address
    const timeoutRef = useRef(null);
    const autoNextTimeoutRef = useRef(null);
    const carouselRef = useRef(null); // Ref for .carousel element
    const nextButtonRef = useRef(null); // Ref for #next button
    const timeRunning = 3000;
    const timeAutoNext = 7000;

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const showSlider = (type) => {
        resetTimeout();

        if (type === 'next') {
            setSliderItems((prevItems) => [...prevItems.slice(1), prevItems[0]]);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderItems.length);
        } else {
            setSliderItems((prevItems) => [prevItems[prevItems.length - 1], ...prevItems.slice(0, prevItems.length - 1)]);
            setCurrentIndex((prevIndex) => (prevIndex - 1 + sliderItems.length) % sliderItems.length);
        }

        // Safely access .carousel element
        if (carouselRef.current) {
            carouselRef.current.classList.remove('next', 'prev');
        }

        // Clear and reset autoNext timeout
        clearTimeout(autoNextTimeoutRef.current);
        autoNextTimeoutRef.current = setTimeout(() => {
            if (nextButtonRef.current) {
                nextButtonRef.current.click(); // Safely click the #next button
            }
        }, timeAutoNext);
    };

    const connectMetaMask = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWalletAddress(accounts[0]); // Set the wallet address after connection
            } catch (error) {
                console.error("User rejected the request:", error);
            }
        } else {
            alert("Please install MetaMask to use this feature.");
        }
    };

    useEffect(() => {
        autoNextTimeoutRef.current = setTimeout(() => {
            if (nextButtonRef.current) {
                nextButtonRef.current.click(); // Safely click the #next button
            }
        }, timeAutoNext);

        return () => {
            clearTimeout(autoNextTimeoutRef.current);
        };
    }, []);

    return (
        <>
            <div id="cover">
                {/* Carousel */}
                <div className="carousel" ref={carouselRef}>
                    <div className="list">
                        {sliderItems.map((item, index) => (
                            <div className="item" key={index} >
                                <img src={item.src} alt={item.title}  />
                                <div className="content">
                                    <div className="author">{item.author}</div>
                                    <div className="title">{item.title}</div>
                                    <div className="topic">{item.topic}</div>
                                    <div className="des">{item.description}</div>
                                    <div className="buttons">
                                        <button>SEE MORE</button>
                                        <button>SUBSCRIBE</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="thumbnail" >
                        {sliderItems.map((item, index) => (
                            <div className="item" key={index}style={{paddingTop:'20px'}}>
                                <img src={item.src} alt={item.title} />
                                <div className="content">
                                    <div className="title"></div>
                                    <div className="description"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="arrows">
                        <button id="prev" onClick={() => showSlider('prev')}>&lt;</button>
                        <button id="next" ref={nextButtonRef} onClick={() => showSlider('next')}>&gt;</button>
                    </div>
                    <div className="time"></div>
                </div>
            </div>
        </>
    );
};

export default NavbarCarousel;