// import React, { useState } from 'react';
// import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

// const ContactInfo = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // API Call hobe ekhane future e
//     console.log('Form Submitted:', formData);
//     alert('Message sent successfully!');
//     setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
//   };

//   return (
//     <section className="py-20 md:py-28 bg-white font-helvetica">
//       <div className="container mx-auto px-6 md:px-8 max-w-7xl">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
//           {/* Left Column: Contact Information */}
//           <div className="flex flex-col fadeInLeft">
//             {/* Badge */}
//             <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-300 w-fit mb-8">
//               <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
//               <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
//                 GET IN TOUCH
//               </span>
//             </div>

//             {/* Heading & Text */}
//             <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
//               Always Here to <br className="hidden md:block" /> Help You
//             </h2>
//             <p className="text-gray-500 text-sm md:text-base font-normal leading-relaxed max-w-md mb-12">
//               There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.
//             </p>

//             {/* Contact Details List */}
//             <div className="flex flex-col space-y-8">
//               {/* Location */}
//               <div className="flex items-start space-x-5 group">
//                 <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 shrink-0 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors duration-300">
//                   <MapPin className="w-6 h-6" />
//                 </div>
//                 <div className="flex flex-col pt-1">
//                   <h4 className="text-xl font-bold text-gray-900 mb-1">Location</h4>
//                   <p className="text-gray-500 text-sm">20, Somewhere in world</p>
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="flex items-start space-x-5 group">
//                 <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 shrink-0 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors duration-300">
//                   <Mail className="w-6 h-6" />
//                 </div>
//                 <div className="flex flex-col pt-1">
//                   <h4 className="text-xl font-bold text-gray-900 mb-1">Email</h4>
//                   <a href="mailto:hello@duralux.com" className="text-gray-500 text-sm hover:text-[#3B82F6] transition-colors">
//                     hello@duralux.com
//                   </a>
//                 </div>
//               </div>

//               {/* Phone */}
//               <div className="flex items-start space-x-5 group">
//                 <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 shrink-0 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors duration-300">
//                   <Phone className="w-6 h-6" />
//                 </div>
//                 <div className="flex flex-col pt-1">
//                   <h4 className="text-xl font-bold text-gray-900 mb-1">Phone</h4>
//                   <a href="tel:+1234567890" className="text-gray-500 text-sm hover:text-[#3B82F6] transition-colors">
//                     +123 456 7890
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Contact Form */}
//           <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 fadeInRight">
//             <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Name Input */}
//                 <div className="flex flex-col">
//                   <input 
//                     type="text" 
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Your Name" 
//                     required
//                     className="w-full bg-[#F8F9FA] text-gray-900 px-6 py-4 rounded-xl outline-none border border-transparent focus:border-[#3B82F6] transition-colors text-sm"
//                   />
//                 </div>
                
//                 {/* Email Input */}
//                 <div className="flex flex-col">
//                   <input 
//                     type="email" 
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="Your Email" 
//                     required
//                     className="w-full bg-[#F8F9FA] text-gray-900 px-6 py-4 rounded-xl outline-none border border-transparent focus:border-[#3B82F6] transition-colors text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Phone Input */}
//               <div className="flex flex-col">
//                 <input 
//                   type="tel" 
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="Phone Number" 
//                   className="w-full bg-[#F8F9FA] text-gray-900 px-6 py-4 rounded-xl outline-none border border-transparent focus:border-[#3B82F6] transition-colors text-sm"
//                 />
//               </div>

//               {/* Subject Input */}
//               <div className="flex flex-col">
//                 <input 
//                   type="text" 
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleChange}
//                   placeholder="Subject" 
//                   required
//                   className="w-full bg-[#F8F9FA] text-gray-900 px-6 py-4 rounded-xl outline-none border border-transparent focus:border-[#3B82F6] transition-colors text-sm"
//                 />
//               </div>

//               {/* Message Input */}
//               <div className="flex flex-col">
//                 <textarea 
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   placeholder="Your Message" 
//                   required
//                   rows="5"
//                   className="w-full bg-[#F8F9FA] text-gray-900 px-6 py-4 rounded-xl outline-none border border-transparent focus:border-[#3B82F6] transition-colors text-sm resize-none"
//                 ></textarea>
//               </div>

//               {/* Submit Button */}
//               <button 
//                 type="submit" 
//                 className="group inline-flex items-center justify-between w-fit space-x-6 bg-zinc-900 hover:bg-[#3B82F6] text-white rounded-full transition-colors pl-8 pr-2 py-2 mt-4"
//               >
//                 <span className="text-sm font-bold tracking-wide">SEND MESSAGE</span>
//                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white transition-transform group-hover:scale-105">
//                   <ArrowUpRight className="w-5 h-5" />
//                 </div>
//               </button>

//             </form>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactInfo;