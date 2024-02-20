import React, { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import LoadingSpinner from './LoadingSpinner';

function Carousel({ images, quantity }) {
    const slides = images;

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.3)', position: 'relative' }}>
            {images ? <div className='max-w-[400px] max-h-[400px] w-full h-full m-auto py-16 px-4 relative group'>
                {quantity < 1 && <div className="absolute top-0 left-0 w-[340px] h-full bg-white opacity-50 pointer-events-none flex justify-center items-center"><p style={{ color: 'black', fontSize: '20px', fontWeight: 'bold', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>Out of Stock</p></div>}



                <img
                    src={slides[currentIndex].url}
                    alt=""
                    className='w-full h-full rounded-2xl object-cover'
                    style={{ objectFit: 'contain', width: '300px', height: '300px' }}
                />
                {/* Left Arrow */}
                {slides.length > 1 && currentIndex > 0 && (
                    <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                        <BsChevronCompactLeft onClick={prevSlide} size={30} />
                    </div>
                )}
                {/* Right Arrow */}
                {slides.length > 1 && currentIndex < slides.length - 1 && (
                    <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
                        <BsChevronCompactRight onClick={nextSlide} size={30} />
                    </div>
                )}
                {/* Dots Container */}
                <div className='flex justify-center w-[300px]' style={{ bottom: '-10%', left: '25%', right: '25%' }}>
                    {slides.map((slide, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => setCurrentIndex(slideIndex)}
                            className='text-2xl cursor-pointer mx-1'
                        >
                            <RxDotFilled />
                        </div>
                    ))}
                </div>


            </div> : <LoadingSpinner />}
        </div>
    );
}

export default Carousel;
