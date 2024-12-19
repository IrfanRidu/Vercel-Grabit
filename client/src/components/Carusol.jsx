// import React, { useState } from 'react';
// import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
// import { RxDotFilled } from 'react-icons/rx';
// import banner1 from "../assets/banner1.jpg"
// import banner2 from "../assets/banner2.jpg"
// import banner3 from "../assets/banner3.jpg"


// export default function Carusol() {
//     const slides = [
//         {
//             banner1:{banner1}
//         },
//         {
//             banner2:{banner2}
//         },
//         {
//             banner3:{banner3}
//         },
//     ]
    
//       const [currentIndex, setCurrentIndex] = useState(0);
    
//       const prevSlide = () => {
//         const isFirstSlide = currentIndex === 0;
//         const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
//         setCurrentIndex(newIndex);
//       };
    
//       const nextSlide = () => {
//         const isLastSlide = currentIndex === slides.length - 1;
//         const newIndex = isLastSlide ? 0 : currentIndex + 1;
//         setCurrentIndex(newIndex);
//       };
    
//       const goToSlide = (slideIndex) => {
//         setCurrentIndex(slideIndex);
//       };
//   return (
//     <div className='max-w-[1400px] h-[780px] w-full m-auto py-16 px-4 relative group'>
//     <div
//     //   style={{ backgroundImage: `{slides${[currentIndex]}}` }}
//       className='w-full h-full rounded-2xl bg-center bg-cover duration-500'
//     >
// {/* {
//     slides.map((img,i)=>{
//         <div className='w-full h-full rounded-2xl bg-center bg-cover duration-500'>
//             <img src={img}/> 
//         </div>
//     })
// } */}

//     </div>
//     {/* Left Arrow */}
//     <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
//       <BsChevronCompactLeft onClick={prevSlide} size={30} />
//     </div>
//     {/* Right Arrow */}
//     <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
//       <BsChevronCompactRight onClick={nextSlide} size={30} />
//     </div>
//     <div className='flex top-4 justify-center py-2'>
//       {slides.map((slide, slideIndex) => (
//        <img
//          src={slide}
//           key={slideIndex}
//           onClick={() => goToSlide(slideIndex)}
//           className='text-2xl cursor-pointer'
//         >
        
//         </img>
//       ))}
//     </div>
//   </div>
//   )
// }



