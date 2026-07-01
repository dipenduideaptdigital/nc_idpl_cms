import React from 'react';
import HeroSectionTwo from '../components/landing-design-2/HeroSectionTwo';
import AboutSectionTwo from '../components/landing-design-2/AboutSectionTwo';
import ServicesSectionTwo from '../components/landing-design-2/ServicesSectionTwo';
import ProcessSectionTwo from '../components/landing-design-2/ProcessSectionTwo';
import ProjectSliderTwo from '../components/landing-design-2/ProjectSliderTwo';
import TrustedPartners from '../components/landing-design-2/TrustedPartners';
import StatsSectionTwo from '../components/landing-design-2/StatsSectionTwo';
import HappySpaces from '../components/landing-design-2/HappySpaces';
import HappyCustomers from '../components/landing-design-2/HappyCustomers';
import TestimonialsTwo from '../components/landing-design-2/TestimonialsTwo';
import CtaSectionTwo from '../components/landing-design-2/CtaSectionTwo';
import ContactFormBlock from '../components/blocks/ContactFormBlock';
import ImageField from '../components/admin/ImageField';

export const puckConfig = {
  components: {
    heroSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        description: { type: "textarea" },
        watermarkText: { type: "text" },
        backgroundImage: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { 
        title: 'Find Your [Inspired]\n[Interior] Design',
        badgeText: 'FAST AND RELIABLE', 
        description: 'Transform your vision into reality with our innovative designs, creating modern spaces that blend functionality, aesthetics, and sustainability.', 
        watermarkText: 'Interior', 
        backgroundImage: '' 
      },
      render: (props) => <HeroSectionTwo data={props} />
    },
    aboutSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        paragraph1: { type: "textarea" },
        paragraph2: { type: "textarea" },
        buttonText: { type: "text" },
        image1: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image2: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image3: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { 
        title: 'Architecture\n[And Interiors, Our Dual]\nExpertise',
        badgeText: 'STARTED IN 1989', 
        paragraph1: 'We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.', 
        paragraph2: 'With a strong presence in Kolkata, Bhubaneswar, and Ranchi, our turnkey office interiors are thoughtfully crafted to enhance productivity, reflect your brand identity, and support the way your team works every day.', 
        buttonText: "Let's Get Started", 
        image1: '', 
        image2: '', 
        image3: '' 
      },
      render: (props) => <AboutSectionTwo data={props} />
    },
    servicesSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        services: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
            image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { title: 'Initial Consultation', description: 'Description...', image: '' }
        }
      },
      defaultProps: { 
        title: 'Explore Our [Comprehensive]\n[Interior Design] Services',
        badgeText: 'OUR SERVICES', 
        services: [
          { title: 'Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' },
          { title: 'Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' },
          { title: 'Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.', image: '' }
        ] 
      },
      render: (props) => <ServicesSectionTwo data={props} />
    },
    processSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        description: { type: "textarea" },
        image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        steps: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" }
          },
          defaultItemProps: { title: 'Step title', description: 'Step description...' }
        }
      },
      defaultProps: { 
        title: 'Description [Architecture]\n[Process] For Exceptional Results.',
        badgeText: 'GET IN TOUCH', 
        description: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.', 
        image: '',
        steps: [
          { title: 'Initial Consultation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
          { title: 'Design & Planning', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
          { title: 'Implementation', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' },
          { title: 'Project Handover', description: 'We Begin By Understanding Your Vision, Goals, And Needs, Followed Antra.' }
        ] 
      },
      render: (props) => <ProcessSectionTwo data={props} />
    },
    projectSliderTwo: {
      fields: {
        projects: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            year: { type: "text" },
            location: { type: "text" },
            image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { title: 'Project Title', year: '2024', location: 'Location', image: '' }
        }
      },
      defaultProps: { 
        projects: [
          { title: 'Industrial Elegance Condo', year: '2024', location: 'Kolkata', image: '' },
          { title: 'Residential Interior Design', year: '2024', location: 'Bhubaneswar', image: '' },
          { title: 'Serene Space Studio', year: '2024', location: 'Ranchi', image: '' },
          { title: 'Art Decor Revival', year: '2024', location: 'Kolkata', image: '' },
          { title: 'Modern Minimalist Oasis', year: '2024', location: 'Siliguri', image: '' },
          { title: 'Corporate Executive Suite', year: '2024', location: 'Delhi', image: '' }
        ] 
      },
      render: (props) => <ProjectSliderTwo data={props} />
    },
    trustedPartners: {
      fields: {
        title: { type: "text" },
        partners: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            logo: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
            heightClass: { 
              type: "select", 
              options: [
                { label: 'Medium (h-11)', value: 'h-11 md:h-[44px]' },
                { label: 'Large (h-12)', value: 'h-12 md:h-[48px]' },
                { label: 'X-Large (h-14)', value: 'h-[54px] md:h-[60px]' }
              ] 
            }
          },
          defaultItemProps: { name: 'Brand Name', logo: '', heightClass: 'h-11 md:h-[44px]' }
        }
      },
      defaultProps: {
        title: 'OUR [TRUSTED PARTNERS]',
        partners: [
          { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
          { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
          { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
          { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
          { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
          { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
        ]
      },
      render: (props) => <TrustedPartners data={props} />
    },
    statsSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        buttonText: { type: "text" },
        backgroundImage: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        stats: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            title: { type: "text" },
            description: { type: "textarea" }
          },
          defaultItemProps: { value: '0', title: 'Stat Label', description: 'Stat description...' }
        }
      },
      defaultProps: { 
        title: 'Behind [Every Statistic]\n[Pulses] A Human Story',
        badgeText: 'TRUSTED EXPERIENCE', 
        buttonText: 'BOOK A FREE CONSULTATION',
        backgroundImage: '',
        stats: [
          { value: '26+', title: 'YEARS EXPERIENCE', description: 'Improving homes with expert craftsmanship for years' },
          { value: '100', title: 'PROJECTS DONE', description: 'Over 250 successful projects delivered with quality and care' },
          { value: '100', title: 'SATISFIED CUSTOMER', description: 'Our team of 30 experts ensures top-quality results' },
          { value: '4+', title: 'LOCATION', description: 'All of our clients are satisfied with our work and service' }
        ] 
      },
      render: (props) => <StatsSectionTwo data={props} />
    },
    happySpaces: {
      fields: {
        badgeText: { type: "text" },
        titleLine1: { type: "text" },
        titleLine2: { type: "text" },
        items: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
            image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
            videoUrl: { type: "text" }
          },
          defaultItemProps: { title: 'Feature title', description: 'Feature description...', image: '', videoUrl: '' }
        }
      },
      defaultProps: { 
        badgeText: 'STRAIGHT FROM THE NEWSROOM', 
        titleLine1: 'Happy Spaces by', 
        titleLine2: 'subhAAkritee',
        items: [
          { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
          { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' },
          { title: 'Functional Design Trends That Blend Style And Comfort', description: 'Modern interior design is all about creating a sleek, functional, and aesthetically pleasing space that reflects contemporary living.', image: '', videoUrl: 'https://www.youtube.com/embed/62bIsvRcPv0' }
        ] 
      },
      render: (props) => <HappySpaces data={props} />
    },
    happyCustomers: {
      fields: {
        title: { type: "text" },
        partners: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            logo: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
            heightClass: { 
              type: "select", 
              options: [
                { label: 'Medium (h-11)', value: 'h-11 md:h-[44px]' },
                { label: 'Large (h-12)', value: 'h-12 md:h-[48px]' },
                { label: 'X-Large (h-14)', value: 'h-[54px] md:h-[60px]' }
              ] 
            }
          },
          defaultItemProps: { name: 'Brand Name', logo: '', heightClass: 'h-11 md:h-[44px]' }
        }
      },
      defaultProps: {
        title: 'OUR [HAPPY CUSTOMERS]',
        partners: [
          { name: 'Aristo', logo: '', heightClass: 'h-11 md:h-[44px]' },
          { name: 'Spitze', logo: '', heightClass: 'h-12 md:h-[48px]' },
          { name: 'Faber', logo: '', heightClass: 'h-11 md:h-[44px]' },
          { name: 'Everyday', logo: '', heightClass: 'h-12 md:h-[48px]' },
          { name: 'Fevicol', logo: '', heightClass: 'h-[54px] md:h-[60px]' },
          { name: 'Urban Ladder', logo: '', heightClass: 'h-11 md:h-[44px]' }
        ]
      },
      render: (props) => <HappyCustomers data={props} />
    },
    testimonialsTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        description: { type: "textarea" },
        mainQuote: { type: "textarea" },
        authorName: { type: "text" },
        authorRole: { type: "text" },
        image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> },
        authorImage: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { 
        title: 'Here’s What [Warm Words]\n[Our Clients] Say',
        badgeText: 'OUR CLIENTS SAY', 
        description: 'Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces functional and stylish commercial interiors', 
        mainQuote: 'I absolutely love my the new modern living room! The clean lines, a neutral tones, and minimalist interior create such a calming & stylish atmosphere. Highly recommend their modern interior design services!', 
        authorName: 'Morgan Dufresne', 
        authorRole: 'Company owner', 
        image: '', 
        authorImage: '' 
      },
      render: (props) => <TestimonialsTwo data={props} />
    },
    ctaSectionTwo: {
      fields: {
        title: { type: "textarea" },
        badgeText: { type: "text" },
        buttonText: { type: "text" }
      },
      defaultProps: { 
        title: 'Have A Project In [Mind?] Let’s\n[Make] It Happen',
        badgeText: 'GET IN TOUCH', 
        buttonText: 'BOOK A FREE CONSULTATION' 
      },
      render: (props) => <CtaSectionTwo data={props} />
    },
    contactForm: {
      fields: {
        formId: { type: "text" },
        formTitle: { type: "text" },
        submitButtonText: { type: "text" },
        redirectPath: { type: "text" }
      },
      defaultProps: { formId: '', formTitle: 'Get in Touch', submitButtonText: 'Submit Inquiry', redirectPath: '' },
      render: (props) => <ContactFormBlock data={props} />
    },
    richText: {
      fields: { content: { type: "textarea" } },
      defaultProps: { content: '<p>Enter your text here.</p>' },
      render: (props) => (
        <div className="py-12 md:py-24 overflow-hidden w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <div 
              className="prose prose-zinc sm:prose-lg max-w-none w-full mx-auto prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl prose-img:w-full break-words overflow-x-auto hide-scrollbar"
              dangerouslySetInnerHTML={{ __html: props.content || '' }}
            />
          </div>
        </div>
      )
    },
    ServiceBanner: {
      fields: {
        title: { type: "text" },
        subTitle: { type: "text" },
        backgroundImage: { 
          type: "custom", 
          render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> 
        }
      },
      defaultProps: {
        title: "Residential Interior",
        subTitle: "Services",
        backgroundImage: ""
      },
      render: ({ title, subTitle, backgroundImage }) => (
        <ServiceBannerBlock 
          title={title} 
          subTitle={subTitle} 
          backgroundImage={backgroundImage} 
        />
      )
    },
  }
};