import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import WhySubhaakritee from '../components/landing/WhySubhaakritee';
import MetricsBarOne from '../components/landing/MetricsBarOne';
import ModernWorkspace from '../components/landing/ModernWorkspace';
import MetricsBarTwo from '../components/landing/MetricsBarTwo';
import SpacesStories from '../components/landing/SpacesStories';
import WayWeCreate from '../components/landing/WayWeCreate';
import GallerySection from '../components/landing/GallerySection';
import TrustedClients from '../components/landing/TrustedClients';
import GetInTouch from '../components/landing/GetInTouch';
import ContactFormBlock from '../components/blocks/ContactFormBlock';
import ImageField from '../components/admin/ImageField';

export const puckConfig = {
  components: {
    heroSection: {
      fields: {
        titleLine1: { type: "text" },
        titleLine2: { type: "text" },
        subtitle: { type: "text" },
        description: { type: "textarea" },
        buttonText: { type: "text" },
        backgroundImage: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { titleLine1: 'End-To-End', titleLine2: 'Office Interiors', subtitle: 'For Every Test & Budget', description: "Simply dummy text of the printing and typesetting. Lorem Ipsum has been the industry's standard,", buttonText: 'Book A Free Consultation', backgroundImage: '' },
      render: (props) => <HeroSection data={props} />
    },
    whySubhaakritee: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        buttonText: { type: "text" },
        features: { 
          type: "array",
          arrayFields: {
            icon: { type: "text" },
            textLine1: { type: "text" },
            textLine2: { type: "text" },
            extraBadge: { type: "text" }
          },
          defaultItemProps: { icon: 'Award', textLine1: 'New Feature', textLine2: 'Description', extraBadge: '' }
        }
      },
      defaultProps: { 
        title: 'WHY subhAAkritee?', 
        description: 'For Over 26 Years...', 
        buttonText: 'Get Free Estimated',
        features: [
          { icon: 'Award', textLine1: '1,400+ design', textLine2: 'experts', extraBadge: '' },
          { icon: 'Home', textLine1: '20,000+ happy', textLine2: 'customers', extraBadge: '' },
          { icon: 'ShieldCheck', textLine1: 'Up to 10-years', textLine2: 'material warranty', extraBadge: '' },
          { icon: 'CalendarDays', textLine1: '45 days or we', textLine2: 'pay you rent', extraBadge: '45' }
        ] 
      },
      render: (props) => <WhySubhaakritee data={props} />
    },
    metricsBarOne: {
      fields: {
        metrics: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            label: { type: "text" }
          },
          defaultItemProps: { value: '100+', label: 'METRIC LABEL' }
        }
      },
      defaultProps: { 
        metrics: [
          { value: '26+', label: 'YEARS EXPERIENCE' },
          { value: '100+', label: 'PROJECTS DONE' },
          { value: '100+', label: 'SATISFIED CUSTOMER' },
          { value: '4+', label: 'LOCATION' }
        ]
      },
      render: (props) => <MetricsBarOne data={props} />
    },
    modernWorkspace: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        services: {
          type: "array",
          arrayFields: {
            icon: { type: "text" },
            title: { type: "text" },
            desc: { type: "textarea" }
          },
          defaultItemProps: { icon: 'Home', title: 'New Service', desc: 'Service description...' }
        }
      },
      defaultProps: { 
        title: 'Modern Workspace Solutions', 
        subtitle: 'SubhAAkritee', 
        services: [
          { icon: 'Hammer', title: 'Modular Kitchen', desc: '' },
          { icon: 'Lightbulb', title: 'Lighting / Ceilings', desc: '' },
          { icon: 'Archive', title: 'Wardrobes', desc: '' },
          { icon: 'Settings', title: 'Smart Homes', desc: '' },
          { icon: 'Monitor', title: 'Furniture / Wood Work', desc: '' },
          { icon: 'Layout', title: 'Space Saving Furniture', desc: '' }
        ]
      },
      render: (props) => <ModernWorkspace data={props} />
    },
    metricsBarTwo: {
      fields: {
        metrics: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            label: { type: "text" }
          },
          defaultItemProps: { value: '1,000+', label: 'METRIC LABEL' }
        }
      },
      defaultProps: { 
        metrics: [
          { value: '3,000+', label: 'INTERIOR DESIGNS' },
          { value: '1,500+', label: 'RENOVATIONS' },
          { value: '500+', label: 'COMMERCIAL PROJECTS' },
          { value: '25+', label: 'AWARDS WON' }
        ]
      },
      render: (props) => <MetricsBarTwo data={props} />
    },
    spacesStories: {
      fields: {
        badgeText: { type: "text" },
        titleLine1: { type: "text" },
        titleLine2: { type: "text" },
        description: { type: "textarea" },
        buttonText: { type: "text" },
        images: { type: "array", arrayFields: { url: { type: "text" }, label: { type: "text" } }, defaultItemProps: { url: '/assets/homepage/gallery1.png', label: 'New Image' } }
      },
      defaultProps: { 
        badgeText: 'ARCHITECTURE AND INTERIOR DESIGN', 
        titleLine1: 'Spaces. Stories.', 
        titleLine2: 'Experiences.', 
        description: '26 Years Of Crafting Environments Defined By Excellence.', 
        buttonText: 'Discover More', 
        images: [
          { url: '/assets/homepage/gallery1.png', label: 'Workspace' }, 
          { url: '/assets/homepage/gallery2.png', label: 'Commercial' }, 
          { url: '/assets/homepage/gallery3.png', label: 'Residential' }
        ] 
      },
      render: (props) => {
        return <SpacesStories data={props} />;
      }
    },
    wayWeCreate: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        buttonText: { type: "text" },
        steps: {
          type: "array",
          arrayFields: {
            icon: { type: "text" },
            title: { type: "text" },
            desc: { type: "textarea" }
          },
          defaultItemProps: { icon: 'PenTool', title: 'New Step', desc: 'Step description...' }
        }
      },
      defaultProps: { 
        title: 'The Way We Create', 
        subtitle: 'Structured Planning. Precise Execution. Exceptional Results.', 
        buttonText: 'Get Free Estimated',
        steps: [
          { icon: 'PenTool', title: 'Consult', desc: "We'll explore ideas and options together." },
          { icon: 'ClipboardList', title: 'Plan', desc: "We'll build a detailed design plan." },
          { icon: 'UserCheck', title: 'Execute', desc: "We'll deliver the project flawlessly." }
        ] 
      },
      render: (props) => <WayWeCreate data={props} />
    },
    gallerySection: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        images: { type: "array", arrayFields: { url: { type: "text" } }, defaultItemProps: { url: '/assets/homepage/gallery1.png' } }
      },
      defaultProps: { 
        title: 'Gallery', 
        subtitle: 'Showcasing Interiors That Inspire, Perform, And Endure', 
        images: [
          { url: '/assets/homepage/gallery1.png' }, 
          { url: '/assets/homepage/gallery2.png' }, 
          { url: '/assets/homepage/gallery3.png' },
          { url: '/assets/homepage/gallery4.png' }
        ] 
      },
      render: (props) => {
        const mappedProps = { ...props, images: props.images?.map(img => img.url) };
        return <GallerySection data={mappedProps} />
      }
    },
    trustedClients: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        reviews: {
          type: "array",
          arrayFields: {
            text: { type: "textarea" },
            author: { type: "text" },
            role: { type: "text" },
            rating: { type: "text" }
          },
          defaultItemProps: { text: 'Great service!', author: 'John Doe', role: 'Customer', rating: '5' }
        }
      },
      defaultProps: { 
        title: 'Trusted By Our Clients', 
        subtitle: "Hear How We've Transformed Spaces And Exceeded Expectations.", 
        reviews: [
          {
            text: "SubhAAkritee transformed our office space into a vibrant, functional environment. The team's attention to detail and commitment to our vision was exceptional.",
            author: "Rajesh Kumar",
            role: "CEO, TechCorp",
            rating: "5"
          },
          {
            text: "We wanted a modern yet cozy home, and they delivered exactly that. Their material quality and design ideas are top-notch. Highly recommended!",
            author: "Sneha Patel",
            role: "Homeowner",
            rating: "5"
          },
          {
            text: "Professional, timely, and incredibly creative. They managed our entire restaurant renovation without a hitch. The 45-day guarantee is real!",
            author: "Amit Singh",
            role: "Restaurant Owner",
            rating: "5"
          }
        ] 
      },
      render: (props) => <TrustedClients data={props} />
    },
    getInTouch: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "text" },
        buttonText: { type: "text" },
        image: { type: "custom", render: ({ value, name, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { title: 'Get In Touch', subtitle: 'Our friendly team would love to hear from you.', buttonText: 'Send Message', image: '' },
      render: (props) => <GetInTouch data={props} />
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
    }
  }
};