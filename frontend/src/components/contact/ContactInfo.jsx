import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import workspaceImg from '../../assets/contact/workspace.png';
import mapImg from '../../assets/contact/Map.png';

const ContactInfo = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Message sent successfully!');
    setFormData({ firstName: '', lastName: '', email: '', contactNo: '', message: '' });
  };

  return (
    <section className="pt-20 md:pt-28 pb-0 bg-white font-helvetica flex flex-col">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-8 lg:gap-12 items-start mb-16 lg:mb-24">
          
          <div className="fadeInLeft shrink-0">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                GET IN TOUCH
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start text-left opal-move-up w-full">
            <h2 className="text-4xl md:text-5xl lg:text-[54px] xl:text-[56px] font-bold text-gray-950 leading-[1.12] tracking-tight font-helvetica w-full">
              <span className="block md:inline whitespace-nowrap">Have a Project In <span className="text-[#3B82F6]">Mind? Let's</span></span>
              <br className="hidden md:block" />
              <span className="text-[#3B82F6]">Make</span> It Happen.
            </h2>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-8 lg:mb-12">
          
          <div className="flex flex-row flex-wrap gap-12 md:gap-24 fadeInLeft">
            {/* Address Info */}
            <div className="flex flex-col text-left">
              <h4 className="text-[15px] font-bold text-gray-900 mb-3 md:mb-4">Address:</h4>
              <p className="text-gray-600 text-sm leading-relaxed max-w-[220px]">
                Office: AG 40 , Sector II, Salt Lake<br />
                City, Kolkata: 700091
              </p>
            </div>

            {/* Support Info */}
            <div className="flex flex-col text-left">
              <h4 className="text-[15px] font-bold text-gray-900 mb-3 md:mb-4">Support</h4>
              <p className="text-gray-900 font-bold text-[15px] mb-1">+91 9831-637-409</p>
              <a href="mailto:Subhaakritee@Hotmail.Com" className="text-gray-600 text-[15px] hover:text-[#3B82F6] transition-colors">
                Subhaakritee@Hotmail.Com
              </a>
            </div>
          </div>
          
          <div className="hidden lg:block"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch pb-20 md:pb-28"> {/* Added padding bottom here */}
          
          <div className="w-full h-[400px] lg:h-full min-h-[450px] lg:min-h-[500px] rounded-[2rem] overflow-hidden fadeInLeft">
            <img 
              src={workspaceImg} 
              alt="Our Workspace" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Right Column */}
          <div className="bg-white fadeInRight flex flex-col justify-center h-full">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-5 md:space-y-6">
              
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-2">First name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name" 
                    required
                    className="w-full bg-white text-gray-900 px-5 py-3.5 rounded-full border border-gray-300 outline-none placeholder:text-gray-300 focus:border-[#3B82F6] transition-colors text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-700 mb-2">Last name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name" 
                    required
                    className="w-full bg-white text-gray-900 px-5 py-3.5 rounded-full border border-gray-300 outline-none placeholder:text-gray-300 focus:border-[#3B82F6] transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@gmail.com" 
                  required
                  className="w-full bg-white text-gray-900 px-5 py-3.5 rounded-full border border-gray-300 outline-none placeholder:text-gray-300 focus:border-[#3B82F6] transition-colors text-sm"
                />
              </div>

              {/* Contact No */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-2">Contact No.</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    placeholder="No." 
                    required
                    className="w-full bg-white text-gray-900 px-5 py-3.5 rounded-full border border-gray-300 outline-none placeholder:text-gray-300 focus:border-[#3B82F6] transition-colors text-sm appearance-none"
                  />
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..." 
                  required
                  rows="5"
                  className="w-full bg-white text-gray-900 px-5 py-4 rounded-2xl border border-gray-300 outline-none placeholder:text-gray-300 focus:border-[#3B82F6] transition-colors text-sm resize-y min-h-[120px]"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="group inline-flex items-center justify-between w-fit border border-gray-300 hover:border-gray-400 bg-white rounded-full transition-colors duration-300 pl-6 pr-1.5 py-1.5 cursor-pointer"
                >
                  <span className="text-[13px] md:text-sm font-bold text-gray-800 pr-10">Send Message</span>
                  <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white transition-transform group-hover:scale-105 shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>

      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] opal-move-up mt-12 md:mt-16">
        <img 
          src={mapImg} 
          alt="Location Map" 
          className="w-full h-full object-cover block" 
        />
      </div>
      
    </section>
  );
};

export default ContactInfo;