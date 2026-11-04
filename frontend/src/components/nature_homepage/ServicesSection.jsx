import DOMPurify from 'dompurify';
import Reveal from '../../animations/Reveal';
import ScrollCardStack from '../../animations/ScrollCardStack';
import ServiceCard from './ServiceCard';
import brush2Img from '../../assets/nc_logo/bush3.png';
import defaultConsultationImg from '../../assets/nc_home/consultation.png';
import card1Img from '../../assets/nc_home/card1.png';
import card2Img from '../../assets/nc_home/card2.png';
import card3Img from '../../assets/nc_home/card3.png';

const getAssetUrl = (path) => {
  if (!path) return '';
  if (typeof path === 'object' && path.url) return getAssetUrl(path.url);
  const pathStr = String(path);
  if (
    pathStr.startsWith('http') || 
    pathStr.startsWith('data:') || 
    pathStr.startsWith('blob:') || 
    pathStr.startsWith('/src/') || 
    pathStr.startsWith('/assets/') ||
    pathStr.startsWith('/@fs/')
  ) {
    return pathStr;
  }
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
    : 'http://localhost:5000';
  return `${baseUrl}${pathStr.startsWith('/') ? pathStr : `/${pathStr}`}`;
};

const defaultServices = [
  {
    number: '01',
    title: 'DESIGN CONSULTATION',
    description: "Every project starts as a question no one has asked yet. We go in deep, past the surface, past the expected and come back with something that didn't exist before.",
    image: defaultConsultationImg
  },
  {
    number: '02',
    title: 'SYSTEM PLANNING & 3D LAYOUT',
    description: "We map equipment, hydraulic flow, filtration systems and calculate lighting spectrums to create balanced, self-sustaining aquatic bio-ecosystems.",
    image: card1Img
  },
  {
    number: '03',
    title: 'TECHNICAL DRAWINGS & HARDSCAPE',
    description: "Precision architectural blueprints defining proportions, Seiryu stone structures, and driftwood arrangements before water is introduced.",
    image: card2Img
  },
  {
    number: '04',
    title: 'INSTALLATION & MAINTENANCE',
    description: "White-glove installation, aquascaping execution, and long-term care programs ensuring crystal clarity and ecological longevity.",
    image: card3Img
  }
];

const ServicesSection = ({ data }) => {
  const tagline = data?.tagline || "our services";
  const headline = data?.headline || "Every project starts as a question no one has asked yet. We go in deep, past the surface, past the expected and come back with something that didn't exist before.";
  const subtext = data?.subtext || "Every project starts as a question no one has asked yet. We go in deep, past the surface, past the expected and come back with something that didn't exist before.";
  
  // Preserve the existing CMS image and text sources.
  let servicesToRender = [];
  if (data?.services && Array.isArray(data.services) && data.services.length > 0) {
    servicesToRender = data.services.map((svc, idx) => {
      const fallback = defaultServices[idx % defaultServices.length] || defaultServices[0];
      return {
        number: svc.number || fallback.number,
        title: svc.title || fallback.title,
        description: svc.description || fallback.description,
        image: (svc.image && typeof svc.image === 'string' && svc.image.trim() !== '') 
          ? svc.image 
          : fallback.image
      };
    });

  } else {
    servicesToRender = defaultServices;
  }

  if (data?.isVisible === false) return null;
  return (
    <section className="relative w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 select-none">
      {/* Original full-size splash, clipped at the page edge without clipping the sticky stack. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-12 sm:top-16 right-0 w-[350px] sm:w-[500px] lg:w-[450px] h-auto opacity-100 translate-x-[30%]">
          <img src={brush2Img} alt="" className="w-full h-auto object-contain rotate-150" />
        </div>
      </div>
      <div className="relative mb-16 sm:mb-20 lg:mb-24">
        <Reveal amount={0.3} duration={1.2} className="relative z-10 max-w-[820px]">
          <span className="font-kanit text-[20px] sm:text-[30px] font-medium text-[#6CAB44] leading-none block lowercase mb-8 sm:mb-10">
            {tagline}
          </span>
          <div
            className="font-kanit text-2xl sm:text-4xl lg:text-[36px] font-light text-zinc-900 leading-[32px] sm:leading-[38px] lg:leading-[42px] max-w-4xl mb-6 sm:mb-8 [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(headline) }}
          />
          <div
            className="font-kanit text-base sm:text-lg text-zinc-500 font-light leading-[26px] sm:leading-[30px] max-w-[500px] [&>p]:m-0"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subtext) }}
          />
        </Reveal>
      </div>

      <ScrollCardStack>
        {servicesToRender.map((service, index) => (
          <ServiceCard key={index} service={{ ...service, image: getAssetUrl(service.image) }} index={index} />
        ))}
      </ScrollCardStack>
    </section>
  );
};

export default ServicesSection;
