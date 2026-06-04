import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/homepage/banner_back.png'; // placeholder, use appropriate image
import {
  Award,
  Home,
  ShieldCheck,
  CalendarDays,
  Hammer,
  Lightbulb,
  Archive,
  Settings,
  Monitor,
  Layout,
  PenTool,
  ClipboardList,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star
} from 'lucide-react';

import gallery1 from '../assets/homepage/gallery1.png';
import gallery2 from '../assets/homepage/gallery2.png';
import gallery3 from '../assets/homepage/gallery3.png';
import gallery4 from '../assets/homepage/gallery4.png';
import gallery5 from '../assets/homepage/gallery5.png';
import interiorImg from '../assets/homepage/interior.png';

const LandingReference = () => {
  const carouselImages = [gallery1, gallery2, gallery3, gallery4, gallery5];
  const [currentIndex, setCurrentIndex] = useState(2);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  const getIndex = (offset) => (currentIndex + offset + carouselImages.length) % carouselImages.length;

  return (
    <div className="font-sans w-full overflow-x-hidden">
      {/* Hero Section */}
      <div
        className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 md:bg-black/10"></div>


        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-8 h-screen flex flex-col justify-center">
          <div className="max-w-2xl mt-16 md:mt-24">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4 tracking-tight">
              End-To-End<br />
              Office Interiors
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
              For Every Test & Budget
            </h2>
            <p className="text-base md:text-lg text-gray-200 mb-10 max-w-lg font-light leading-relaxed">
              Simply dummy text of the printing and typesetting.
              Lorem Ipsum has been the industry's standard,
            </p>
            <button className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-3.5 rounded-md text-sm font-bold tracking-wide transition-all shadow-lg hover:shadow-orange-500/30 uppercase">
              Book A Free Consultation
            </button>
          </div>
        </div>
      </div>

      {/* WHY subhAAkritee? Section */}
      <section className="py-20 px-8 bg-white text-center">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">WHY subhAAkritee?</h2>
          <p className="text-gray-600 mb-16 text-sm md:text-base leading-relaxed max-w-3xl mx-auto font-medium">
            For Over 26 Years, SubhAAkritee - The Design People Has Delivered Innovative, High-Quality Interior And Architectural Solutions Across Residential And Commercial Spaces. With A Strong Presence In Kolkata, Delhi, Siliguri, And Bhubaneswar, We Transform Spaces Into Functional Works Of Art
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 text-gray-500 mb-4 stroke-1" />
              <p className="text-sm font-semibold text-gray-700">1,400+ design<br />experts</p>
            </div>
            <div className="flex flex-col items-center">
              <Home className="w-12 h-12 text-gray-500 mb-4 stroke-1" />
              <p className="text-sm font-semibold text-gray-700">20,000+ happy<br />customers</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-12 h-12 text-gray-500 mb-4 stroke-1" />
              <p className="text-sm font-semibold text-gray-700">Up to 10-years<br />material warranty</p>
            </div>
            <div className="flex flex-col items-center relative">
              <div className="relative">
                <CalendarDays className="w-12 h-12 text-gray-500 mb-4 stroke-1" />
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500">45</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">45 days or we<br />pay you rent</p>
            </div>
          </div>

          <button className="bg-[#cd7f32] hover:bg-orange-700 text-white px-8 py-3 rounded-md text-sm font-medium transition-all shadow-md">
            Get Free Estimated
          </button>
        </div>
      </section>

      {/* Metrics Bar 1 */}
      <section className="py-12 px-8 bg-[#f0f6fc]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-transparent">
            <div className="flex flex-col">
              <span className="text-red-500 font-bold text-xl tracking-wide mb-1">ON-TIME</span>
              <span className="text-gray-900 font-medium text-lg uppercase tracking-wide">DELIVERY</span>
            </div>
            <div className="flex flex-col">
              <span className="text-red-500 font-bold text-xl tracking-wide mb-1">BEST</span>
              <span className="text-gray-900 font-medium text-lg uppercase tracking-wide">PRICE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-red-500 font-bold text-xl tracking-wide mb-1">SUPERIOR</span>
              <span className="text-gray-900 font-medium text-lg uppercase tracking-wide">QUALITY</span>
            </div>
            <div className="flex flex-col">
              <span className="text-red-500 font-bold text-xl tracking-wide mb-1">SAFETY</span>
              <span className="text-gray-900 font-medium text-lg uppercase tracking-wide">ASSURED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Workspace Solutions Section */}
      <section className="py-20 px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-gray-900">Modern Workspace Solutions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 text-center">
            {/* Service 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center mb-6 text-blue-600">
                <Hammer className="w-12 h-12 stroke-1" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Renovation & Upgrade</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Transforming existing offices into contemporary, high-performing spaces.
              </p>
            </div>

            {/* Service 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center mb-6 text-blue-600">
                <Lightbulb className="w-12 h-12 stroke-1" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lighting & Electrical</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Efficient lighting systems and seamless electrical planning for optimal performance.
              </p>
            </div>

            {/* Service 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center mb-6 text-blue-600">
                <Archive className="w-12 h-12 stroke-1" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Furniture</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Ergonomic, bespoke workstations, cabins, and storage solutions.
              </p>
            </div>

            {/* Service 4 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center mb-6 text-blue-600">
                <Settings className="w-12 h-12 stroke-1" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Turnkey Execution</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Complete project management from concept and design to final handover.
              </p>
            </div>

            {/* Service 5 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center mb-6 text-blue-600">
                <Monitor className="w-12 h-12 stroke-1" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Office Interiors</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Modern, brand-aligned workspace designs that balance aesthetics and functionality.
              </p>
            </div>

            {/* Service 6 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center mb-6 text-blue-600">
                <Layout className="w-12 h-12 stroke-1" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Space Planning</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Smart layouts designed to maximize efficiency, workflow, and space utilization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar 2 */}
      <section className="py-12 px-8 bg-[#f0f6fc]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col">
              <span className="text-red-500 font-bold text-4xl mb-2">26+</span>
              <span className="text-gray-900 font-medium text-sm md:text-base uppercase tracking-wide">YEARS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-red-500 font-bold text-4xl mb-2">100</span>
              <span className="text-gray-900 font-medium text-sm md:text-base uppercase tracking-wide">PROJECTS DONE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-red-500 font-bold text-4xl mb-2">100</span>
              <span className="text-gray-900 font-medium text-sm md:text-base uppercase tracking-wide">SATISFIED CUSTOMER</span>
            </div>
            <div className="flex flex-col">
              <span className="text-red-500 font-bold text-4xl mb-2">4+</span>
              <span className="text-gray-900 font-medium text-sm md:text-base uppercase tracking-wide">LOCATION</span>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces. Stories. Experiences. Section */}
      <section className="py-24 bg-white text-center overflow-hidden">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">Spaces. Stories. Experiences.</h2>
        <p className="text-gray-600 mb-8 text-sm md:text-base">26 Years Of Crafting Environments Defined By Excellence.</p>

        <div className="relative w-full max-w-[1600px] mx-auto mt-12 px-4 group">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-gray-800 p-3 md:p-4 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-40 bg-white/90 hover:bg-white text-gray-800 p-3 md:p-4 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <div className="relative flex justify-center items-center h-[300px] md:h-[500px] overflow-hidden">
            {carouselImages.map((src, index) => {
              let offset = index - currentIndex;

              // Handle wrapping for infinite loop effect
              if (offset < -2) offset += carouselImages.length;
              if (offset > 2) offset -= carouselImages.length;

              // Compute styles based on offset
              let x = 0;
              let scale = 1;
              let zIndex = 30;
              let opacity = 1;
              let brightness = "brightness-100";

              if (offset === 0) {
                x = 0; scale = 1; zIndex = 30; opacity = 1; brightness = "brightness-100";
              } else if (offset === -1) {
                x = -75; scale = 0.85; zIndex = 20; opacity = 1; brightness = "brightness-50";
              } else if (offset === 1) {
                x = 75; scale = 0.85; zIndex = 20; opacity = 1; brightness = "brightness-50";
              } else if (offset === -2) {
                x = -150; scale = 0.7; zIndex = 10; opacity = 0.6; brightness = "brightness-50";
              } else if (offset === 2) {
                x = 150; scale = 0.7; zIndex = 10; opacity = 0.6; brightness = "brightness-50";
              }

              return (
                <div
                  key={index}
                  className={`absolute w-[60%] md:w-[35%] h-[90%] md:h-[100%] transition-all duration-700 ease-in-out cursor-pointer shadow-2xl ${brightness}`}
                  style={{
                    transform: `translateX(${x}%) scale(${scale})`,
                    zIndex: zIndex,
                    opacity: opacity,
                  }}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img src={src} className="w-full h-full object-cover" alt={`Gallery ${index}`} />

                  {/* Overlay for center active image */}
                  <div className={`absolute inset-0 transition-opacity duration-700 ${offset === 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white text-2xl md:text-4xl font-bold tracking-wide">Workspace</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Way We Create Section */}
      <section className="py-20 px-8 bg-[#f0f6fc] text-center">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">The Way We Create</h2>
          <p className="text-gray-600 mb-16 text-sm md:text-base tracking-wide">Structured Planning. Precise Execution. Exceptional Results.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="flex flex-col items-center">
              <PenTool className="w-16 h-16 text-[#4a7eb0] mb-6 stroke-1" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discover & Design</h3>
              <p className="text-gray-600 text-sm max-w-[16rem] leading-relaxed">Understanding your vision, space, and goals.</p>
            </div>

            <div className="flex flex-col items-center">
              <ClipboardList className="w-16 h-16 text-[#4a7eb0] mb-6 stroke-1" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Build & Manage</h3>
              <p className="text-gray-600 text-sm max-w-[16rem] leading-relaxed">Seamless execution with expert supervision and quality control.</p>
            </div>

            <div className="flex flex-col items-center">
              <UserCheck className="w-16 h-16 text-[#4a7eb0] mb-6 stroke-1" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Deliver & Support</h3>
              <p className="text-gray-600 text-sm max-w-[16rem] leading-relaxed">On-time handover with precision finishing and continued assistance.</p>
            </div>
          </div>

          <button className="bg-[#cd7f32] hover:bg-orange-700 text-white px-8 py-3 rounded-md text-sm font-medium transition-all shadow-md">
            Get Free Estimated
          </button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">Gallery</h2>
        <p className="text-gray-600 mb-12 text-sm md:text-base">Showcasing Interiors That Inspire, Perform, And Endure</p>

        <div className="container mx-auto px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <img src={gallery1} className="w-full h-64 object-cover shadow-sm hover:shadow-lg transition-shadow duration-300" alt="Gallery 1" />
            <img src={gallery2} className="w-full h-64 object-cover shadow-sm hover:shadow-lg transition-shadow duration-300" alt="Gallery 2" />
            <img src={gallery3} className="w-full h-64 object-cover shadow-sm hover:shadow-lg transition-shadow duration-300" alt="Gallery 3" />
            <img src={gallery4} className="w-full h-64 object-cover shadow-sm hover:shadow-lg transition-shadow duration-300" alt="Gallery 4" />
            <img src={gallery5} className="w-full h-64 object-cover shadow-sm hover:shadow-lg transition-shadow duration-300" alt="Gallery 5" />
            <img src={gallery1} className="w-full h-64 object-cover shadow-sm hover:shadow-lg transition-shadow duration-300" alt="Gallery 6" />
          </div>
        </div>
      </section>

      {/* Trusted By Our Clients Section */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight">Trusted By Our Clients</h2>
        <p className="text-gray-600 mb-6 text-sm md:text-base">Hear How We've Transformed Spaces And Exceeded Expectations.</p>

        <div className="flex justify-center items-center space-x-2 mb-2">
          {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-7 h-7 fill-yellow-400 text-yellow-400" />)}
        </div>
        <p className="text-gray-500 mb-16 text-sm">4.5 average star review</p>

        <div className="container mx-auto px-4 max-w-[1400px] overflow-hidden relative">
          <div className="flex justify-center space-x-6 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory px-4 md:px-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#eef3ee] rounded-2xl p-8 md:p-10 text-left min-w-[300px] w-[360px] flex-shrink-0 snap-center shadow-sm">
                <p className="text-gray-700 text-sm mb-10 leading-relaxed font-medium">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex-shrink-0"></div>
                  <span className="font-bold text-gray-900 text-lg">Stephanie</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center space-x-3 mt-4">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-gray-500"></div>
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="py-20 bg-[#eef6fc]">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-stretch">

            {/* Left: Form */}
            <div className="flex-1 max-w-2xl pt-8 md:pl-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">Get in touch.</h2>
              <p className="text-gray-500 mb-10 text-sm md:text-base leading-relaxed max-w-md">
                Reach out to us today to schedule your personalized design consultation and start bringing your vision of nature to life.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 font-medium mb-2">First name</label>
                    <input type="text" placeholder="First name" className="px-4 py-3 rounded-xl border border-white bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm text-sm" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 font-medium mb-2">Last name</label>
                    <input type="text" placeholder="Last name" className="px-4 py-3 rounded-xl border border-white bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm text-sm" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 font-medium mb-2">Email</label>
                  <input type="email" placeholder="you@gmail.com" className="px-4 py-3 rounded-xl border border-white bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm text-sm" />
                </div>

                <div className="flex flex-col relative">
                  <label className="text-xs text-gray-500 font-medium mb-2">Contact No.</label>
                  <div className="relative">
                    <input type="text" placeholder="No." className="w-full px-4 py-3 rounded-xl border border-white bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm text-sm" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 font-medium mb-2">Message</label>
                  <textarea placeholder="Write your message.." rows="5" className="px-4 py-3 rounded-xl border border-white bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm text-sm resize-none"></textarea>
                </div>

                <button type="button" className="w-full bg-[#f4a261] hover:bg-[#e78c45] text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-between group mt-4">
                  <span>Submit</span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#f4a261] transition-transform group-hover:translate-x-1">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              </form>
            </div>

            {/* Right: Image */}
            <div className="flex-1 lg:max-w-xl relative min-h-[400px] lg:min-h-full">
              <img src={gallery4} alt="Interior Design" className="absolute inset-0 w-full h-full object-cover shadow-sm rounded-2xl" />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingReference;