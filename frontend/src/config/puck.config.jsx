import React from 'react';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import AboutSection from '../components/home/AboutSection';
import OurServices from '../components/home/OurServices';
import HowWeWork from '../components/home/HowWeWork';
import OurProjects from '../components/home/OurProjects';
import Panoramas from '../components/home/Panoramas';
import Team from '../components/home/Team';
import Testimonials from '../components/home/Testimonials';
import VideoBanner from '../components/home/VideoBanner';
import BlogSection from '../components/home/BlogSection';
import Gallery from '../components/home/Gallery';
import CtaSection from '../components/home/CtaSection';
import ContactFormBlock from '../components/blocks/ContactFormBlock';
import ImageField from '../components/admin/ImageField';

export const puckConfig = {
  components: {
    hero: {
      fields: {
        badgeText: { type: "text" },
        titleLine1: { type: "text" },
        titleLine2: { type: "text" },
        subtitle: { type: "textarea" },
        buttonText: { type: "text" },
        glassCardNumber: { type: "text" },
        glassCardText1: { type: "text" },
        glassCardText2: { type: "text" },
        backgroundImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        frontImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        titleLine1: 'End-To-End', titleLine2: 'Office Interiors',
        subtitle: 'We specialize in transforming visions into reality.',
        buttonText: 'BOOK A FREE CONSULTATION', badgeText: 'Fast and Reliable',
        glassCardNumber: '250+', glassCardText1: 'My Design of art', glassCardText2: 'There Is No One Who Loves Pain Itself',
        backgroundImage: '', frontImage: ''
      },
      render: (props) => <Hero data={props} />
    },
    services: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        services: {
          type: "array",
          getItemSummary: (item) => item.title || "New Service",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" }
          }
        }
      },
      defaultProps: {
        badgeText: 'WHO WE ARE', title: 'Experience [The Art Of Interior] Design',
        description: 'We offer professional design services.',
        services: [
          { title: 'Architectural\nDesign', description: 'Brief description here' },
          { title: 'Interior Design\n& Planning', description: 'Brief description here' }
        ]
      },
      render: (props) => <Services data={props} />
    },
    about: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        buttonText: { type: "text" },
        image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        highlights: {
          type: "array",
          getItemSummary: (item) => item?.value || "Highlight",
          arrayFields: {
            value: { type: "text" } // Puck arrays expect objects, so we'll need to map this in the adapter if we use primitive arrays
          } // We'll simplify and use a text block for each highlight, but Puck needs objects
        }
      },
      defaultProps: {
        badgeText: 'STARTED IN 1991', title: 'Where Spaces Inspire, And [Design Comes Alive]',
        description: 'Dedicated to bringing your vision to life.', buttonText: 'More About Us', image: '',
        highlights: [{ value: 'Latest Technologies' }, { value: 'High-Quality Designs' }]
      },
      render: (props) => {
        // Map Puck's object array back to primitive array for the component if needed
        const mappedProps = {
          ...props,
          highlights: props.highlights?.map(h => typeof h === 'object' ? h.value : h) || []
        };
        return <AboutSection data={mappedProps} />;
      }
    },
    our_services: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        bottomImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        services: {
          type: "array",
          arrayFields: { id: { type: "text" }, title: { type: "text" } }
        },
        stats: {
          type: "array",
          arrayFields: { value: { type: "text" }, title: { type: "text" }, description: { type: "text" } }
        }
      },
      defaultProps: {
        badgeText: 'OUR SERVICES', title: 'Explore Our Services', description: '...', image: '', bottomImage: '',
        services: [{ id: '01', title: 'Residential Interior Design' }],
        stats: [{ value: '26+', title: 'YEARS EXPERIENCE', description: '...' }]
      },
      render: (props) => <OurServices data={props} />
    },
    how_we_work: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        bottomText: { type: "text" },
        bottomLinkText: { type: "text" },
        bottomLinkUrl: { type: "text" },
        steps: {
          type: "array",
          arrayFields: { id: { type: "text" }, title: { type: "text" }, description: { type: "textarea" } }
        }
      },
      defaultProps: {
        badgeText: 'HOW WE WORK', title: 'Process', description: '...', bottomText: '...', bottomLinkText: '...', bottomLinkUrl: '#',
        steps: [{ id: '01', title: 'Initial Consultation', description: '...' }]
      },
      render: (props) => <HowWeWork data={props} />
    },
    our_projects: {
      fields: {
        badgeText: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        bottomImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        projects: {
          type: "array",
          arrayFields: { id: { type: "number" }, category: { type: "text" }, title: { type: "text" }, description: { type: "textarea" }, image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> } }
        }
      },
      defaultProps: {
        badgeText: 'OUR PROJECT', title: 'Creative Projects', description: '...', bottomImage: '',
        projects: [{ id: 1, category: 'LANDSCAPE', title: 'Art Deco Revival', description: '...', image: '' }]
      },
      render: (props) => <OurProjects data={props} />
    },
    panoramas: {
      fields: { badgeText: { type: "text" }, title: { type: "text" }, image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> } },
      defaultProps: { badgeText: '360-DEGREE PANORAMAS', title: 'Experience', image: '' },
      render: (props) => <Panoramas data={props} />
    },
    team: {
      fields: {
        badgeText: { type: "text" }, title: { type: "text" }, description: { type: "textarea" }, image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        members: { type: "array", arrayFields: { id: { type: "text" }, name: { type: "text" }, role: { type: "text" } } }
      },
      defaultProps: {
        badgeText: 'TEAM', title: 'Meet The Experts', description: '...', image: '',
        members: [{ id: '01', name: 'Mark Jackson', role: 'CEO' }]
      },
      render: (props) => <Team data={props} />
    },
    testimonials: {
      fields: {
        badgeText: { type: "text" }, title: { type: "text" }, description: { type: "textarea" }, image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> },
        ratingValue: { type: "text" }, reviewCount: { type: "text" }, conceptText: { type: "textarea" },
        mainQuote: { type: "textarea" }, authorImage: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> }, authorName: { type: "text" }, authorRole: { type: "text" },
        bottomText: { type: "text" },
        logos: { type: "array", arrayFields: { value: { type: "text" } } }
      },
      defaultProps: {
        badgeText: 'TESTIMONIALS', title: 'Client Words', description: '...', image: '', ratingValue: '4.80', reviewCount: '2,688 Reviews',
        conceptText: '...', mainQuote: '...', authorImage: '', authorName: 'Morgan', authorRole: 'Owner', bottomText: '...',
        logos: [{ value: 'LOGO 01' }]
      },
      render: (props) => {
        const mappedProps = {
          ...props,
          logos: props.logos?.map(l => typeof l === 'object' ? l.value : l) || []
        };
        return <Testimonials data={mappedProps} />;
      }
    },
    video_banner: {
      fields: { videoId: { type: "text" }, image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> }, title: { type: "text" }, description: { type: "textarea" } },
      defaultProps: { videoId: 'ScMzIvxBSi4', image: '', title: 'UNLOCK YOUR DREAM HOME TODAY!', description: '...' },
      render: (props) => <VideoBanner data={props} />
    },
    blog_section: {
      fields: {
        badgeText: { type: "text" }, title: { type: "text" },
        posts: { type: "array", arrayFields: { id: { type: "number" }, author: { type: "text" }, title: { type: "text" }, excerpt: { type: "textarea" }, image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> } } }
      },
      defaultProps: {
        badgeText: 'BLOG', title: 'Latest News',
        posts: [{ id: 1, author: 'Admin', title: 'Design Trends', excerpt: '...', image: '' }]
      },
      render: (props) => <BlogSection data={props} />
    },
    gallery: {
      fields: {
        bgText: { type: "text" },
        images: { type: "array", arrayFields: { value: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> } } }
      },
      defaultProps: { bgText: 'gallery', images: [{ value: '' }] },
      render: (props) => {
        const mappedProps = {
          ...props,
          images: props.images?.map(i => typeof i === 'object' ? i.value : i) || []
        };
        return <Gallery data={mappedProps} />;
      }
    },
    cta: {
      fields: { badgeText: { type: "text" }, title: { type: "text" }, buttonText: { type: "text" } },
      defaultProps: { badgeText: 'GET IN TOUCH', title: "Let's Make It Happen", buttonText: 'BOOK A FREE CONSULTATION' },
      render: (props) => <CtaSection data={props} />
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