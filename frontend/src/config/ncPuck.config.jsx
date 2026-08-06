import React, { useState } from 'react';
import { Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import TipTapEditor from '../components/admin/TipTapEditor';
import ContactFormBlock from '../components/blocks/ContactFormBlock';
import ImageField from '../components/admin/ImageField';

// Ripple Components
import RipplesHero from '../components/ripples/RipplesHero';
import RipplesIntroSection from '../components/ripples/RipplesIntroSection';
import RipplesNatureAquariumSection from '../components/ripples/RipplesNatureAquariumSection';
import RipplesLetsBeginSection from '../components/ripples/RipplesLetsBeginSection';
import RipplesAquascapeSection from '../components/ripples/RipplesAquascapeSection';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';

// Gulmo Components
import GulmoHero from '../components/gulmo/GulmoHero';
import GulmoTerrariumSection from '../components/gulmo/GulmoTerrariumSection';
import GulmoQuoteSection from '../components/gulmo/GulmoQuoteSection';
import GulmoForestOrganismSection from '../components/gulmo/GulmoForestOrganismSection';
import GulmoOurProjectsSection from '../components/gulmo/GulmoOurProjectsSection';
import GulmoLetsBeginSection from '../components/gulmo/GulmoLetsBeginSection';
import GulmoConceptSection from '../components/gulmo/GulmoConceptSection';

// Prakriti Components
import PrakritiHero from '../components/prakriti/PrakritiHero';
import PrakritiIntroSection from '../components/prakriti/PrakritiIntroSection';
import PrakritiEducationSection from '../components/prakriti/PrakritiEducationSection';
import PrakritiUpcomingWorkshopsSection from '../components/prakriti/PrakritiUpcomingWorkshopsSection';
import PrakritiLabExperienceSection from '../components/prakriti/PrakritiLabExperienceSection';
import PrakritiLabShowcaseSection from '../components/prakriti/PrakritiLabShowcaseSection';
import PrakritiGetInTouchSection from '../components/prakriti/PrakritiGetInTouchSection';
import PrakritiLetsBeginSection from '../components/prakriti/PrakritiLetsBeginSection';

// Workshop Components
import WorkshopHero from '../components/workshop/WorkshopHero';
import WorkshopDetailsSection from '../components/workshop/WorkshopDetailsSection';
import WorkshopGallerySection from '../components/workshop/WorkshopGallerySection';

// ABOUT PAGE COMPONENTS
import AboutHorizontalScroll from '../components/nc_about/AboutHorizontalScroll';

const CollapsibleTiptap = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewText = (html) => {
    if (!html) return 'No content added...';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || '';
    return text.length > 50 ? text.substring(0, 50) + '...' : text || 'No content added...';
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors outline-none"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Edit2 className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-sm text-gray-600 truncate">
              {isOpen ? 'Close Editor' : getPreviewText(value)}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
          )}
        </button>
        
        {isOpen && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <TipTapEditor value={value || ''} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export const ncPuckConfig = {
  components: {

    // GENERIC BLOCKS
    richText: {
      fields: { 
        content: { 
          type: "custom", 
          render: ({ value, onChange }) => (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <TipTapEditor value={value || ''} onChange={onChange} />
            </div>
          ) 
        } 
      },
      defaultProps: { content: '<p>Enter your text here.</p>' },
      render: (props) => (
        <div className="py-12 md:py-24 overflow-hidden w-full bg-[#070e06] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
            <div 
              className="prose prose-invert sm:prose-lg max-w-none w-full mx-auto prose-headings:font-semibold prose-a:text-[#7BA641] hover:prose-a:text-[#6b9337] prose-img:rounded-xl prose-img:w-full break-words overflow-x-auto hide-scrollbar"
              dangerouslySetInnerHTML={{ __html: props.content || '' }}
            />
          </div>
        </div>
      )
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

    getStartedCta: {
      fields: {
        title: { type: "textarea" },
        buttonText: { type: "text" }
      },
      defaultProps: {
        title: 'Ready to build your dream aquarium?',
        buttonText: 'Get Started'
      },
      render: (props) => <GetStartedCtaSection data={props} />
    },


    // RIPPLES PAGE BLOCKS
    ripplesHero: {
      fields: {
        backgroundImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { backgroundImage: '' },
      render: (props) => <RipplesHero data={props} />
    },

    ripplesIntro: {
      fields: {
        mainTitle: { type: "textarea" },
        subTitle: { type: "textarea" },
        description: { 
          type: "custom", 
          render: ({ value, onChange }) => <CollapsibleTiptap label="Description" value={value} onChange={onChange} /> 
        },
        personImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        quote: { type: "textarea" },
        authorName: { type: "text" }
      },
      defaultProps: {
        mainTitle: 'It is a long established fact that a reader will be distracted.',
        subTitle: 'It is a long established fact that a reader will be distracted.',
        description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India. Specializing in setting up Nature Aquariums and Biotopes that mimic actual fish habitats, we offer international quality brands and exceptional customer service, helping you build and maintain your dream aquarium.',
        personImage: '',
        quote: '“To know Mother Nature is to love her smallest creations.”',
        authorName: '–Takashi Amano'
      },
      render: (props) => <RipplesIntroSection data={props} />
    },

    ripplesNatureAquarium: {
      fields: {
        section1Title: { type: "text" },
        card1Image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        card1Title: { type: "textarea" },
        card1Description: { type: "textarea" },
        section2Title: { type: "text" },
        section2Description: { type: "textarea" },
        card2Image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        card2Caption: { type: "textarea" }
      },
      defaultProps: {
        section1Title: 'What is Nature Aquarium?',
        card1Image: '',
        card1Title: 'It is a long established fact that a reader will be distracted.',
        card1Description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.',
        section2Title: 'OUR PROJECTS',
        section2Description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.',
        card2Image: '',
        card2Caption: 'It is a long established fact that a reader will be distracted.'
      },
      render: (props) => <RipplesNatureAquariumSection data={props} />
    },

    ripplesLetsBegin: {
      fields: {
        heading: { type: "text" },
        introText: { type: "textarea" },
        bottomImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        steps: {
          type: "array",
          arrayFields: {
            num: { type: "text" },
            title: { type: "text" },
            description: { type: "textarea" },
            img: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { num: '01', title: 'New Step', description: 'Step description goes here...', img: '' }
        }
      },
      defaultProps: {
        heading: "Let's begin",
        introText: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.',
        bottomImage: '',
        steps: [
          { num: '01', title: 'Design Consultation', description: 'Founded in 2014 with a vision...', img: '' },
          { num: '02', title: 'Space Planning', description: 'Founded in 2014 with a vision...', img: '' },
          { num: '03', title: 'Implementation', description: 'Founded in 2014 with a vision...', img: '' },
          { num: '04', title: 'Maintenance', description: 'Founded in 2014 with a vision...', img: '' }
        ]
      },
      render: (props) => <RipplesLetsBeginSection data={props} />
    },

    ripplesAquascape: {
      fields: {
        subtitle: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        categories: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            label: { type: "text" },
            desc: { type: "textarea" },
            img: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { id: 'new', label: 'New Category', desc: 'Description', img: '' }
        },
        gallerySubtitle: { type: "text" },
        galleryTitle: { type: "text" },
        galleries: {
          type: "array",
          arrayFields: {
            img: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
            caption: { type: "text" }
          },
          defaultItemProps: { img: '', caption: 'New Gallery Item' }
        }
      },
      defaultProps: {
        subtitle: 'RIPPLES AQUATIC STUDIO',
        title: 'LIVING ART UNDER WATER',
        description: 'At Ripples Aquatic Studio, we engineer pristine underwater ecosystems that bring tranquility, life, and architectural grandeur into your space.',
        categories: [
          { id: 'nature', label: 'Nature Aquariums', desc: 'Captivating underwater landscapes styled after natural forests, mountains, and valleys.', img: '' },
          { id: 'biotope', label: 'Low-Maintenance Biotopes', desc: 'Authentic habitat recreations tailored for easy maintenance.', img: '' }
        ],
        gallerySubtitle: 'GALLERY SHOWCASE',
        galleryTitle: 'CRAFTED WITH PRECISION & PASSION',
        galleries: [
          { img: '', caption: 'Nature Aquarium Hardscape' },
          { img: '', caption: 'High Precision CO2 Plant System' }
        ]
      },
      render: (props) => <RipplesAquascapeSection data={props} />
    },


    // GULMO PAGE BLOCKS
    gulmoHero: {
      fields: {
        backgroundImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { backgroundImage: '' },
      render: (props) => <GulmoHero data={props} />
    },

    gulmoTerrarium: {
      fields: {
        mainJarImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        cat1Title: { type: "text" }, cat1Desc: { type: "textarea" }, cat1Icon: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        cat2Title: { type: "text" }, cat2Desc: { type: "textarea" }, cat2Icon: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        cat3Title: { type: "text" }, cat3Desc: { type: "textarea" }, cat3Icon: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        bottomJar1: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        bottomJar2: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        bottomJar3: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        bottomJar4: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
      },
      defaultProps: {
        cat1Title: 'Terrariums',
        cat1Desc: 'Elevate your indoor spaces with lush, green gardens...',
        cat2Title: 'Paludariums',
        cat2Desc: 'Experience the best of both worlds with our paludariums...',
        cat3Title: 'Indoor Gardens',
        cat3Desc: 'Transform any space with our custom-designed aquariums...'
      },
      render: (props) => <GulmoTerrariumSection data={props} />
    },

    gulmoQuote: {
      fields: {
        bgImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        quoteIcon: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        quoteText: { type: "textarea" },
        quoteAuthor: { type: "text" }
      },
      defaultProps: {
        quoteText: "The forest is a peculiar organism of unlimited kindness and benevolence that makes no demands for its sustenance...",
        quoteAuthor: "Gautama Buddha"
      },
      render: (props) => <GulmoQuoteSection data={props} />
    },

    gulmoForestOrganism: {
      fields: {
        mainTitle: { type: "text" },
        brushImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        jarImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        f1Label: { type: "text" }, f1Title: { type: "text" }, f1Desc: { type: "textarea" },
        f2Label: { type: "text" }, f2Title: { type: "text" }, f2Desc: { type: "textarea" },
        f3Label: { type: "text" }, f3Title: { type: "text" }, f3Desc: { type: "textarea" },
        f4Label: { type: "text" }, f4Sub: { type: "text" }, f4Title: { type: "text" }, f4Desc: { type: "textarea" },
        f5Label: { type: "text" }, f5Title: { type: "text" }, f5Desc: { type: "textarea" },
        f6Label: { type: "text" }, f6Sub: { type: "text" }, f6Title: { type: "text" }, f6Desc: { type: "textarea" },
      },
      defaultProps: {
        mainTitle: "The Forest Is A Peculiar Organism",
        f1Label: "GLASS", f1Title: "GLASS: TOP CASE", f1Desc: "A tall glass cover...",
        f2Label: "LIGHTING", f2Title: "LIGHTING SYSTEM", f2Desc: "High-spectrum LED...",
        f3Label: "PLANTS", f3Title: "PLANTS & FLORA", f3Desc: "Lush evergreen mosses...",
        f4Label: "TERRA BASE", f4Sub: "PLATE", f4Title: "TERRA BASE", f4Desc: "Cylindrical porous...",
        f5Label: "SUBSTRATE", f5Title: "SUBSTRATE & SOIL", f5Desc: "Multi-layered nutrient...",
        f6Label: "TOOL", f6Sub: "MAINTENANCE", f6Title: "LAYOUT TOOL", f6Desc: "Precision tools..."
      },
      render: (props) => <GulmoForestOrganismSection data={props} />
    },

    gulmoOurProjects: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        bgSplash: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        imageLeft: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        imageRight: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        title: "OUR PROJECTS",
        description: "Founded in 2014 with a vision of promoting ethical fish keeping..."
      },
      render: (props) => <GulmoOurProjectsSection data={props} />
    },

    gulmoLetsBegin: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        storeUrl: { type: "text" },
        storeUrlText: { type: "text" },
        btnText: { type: "text" },
        imageMain: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        imageOverlay: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        title: "Let's begin",
        description: "Founded in 2014 with a vision...",
        storeUrl: "https://naturecube.store",
        storeUrlText: "naturecube.store",
        btnText: "STORE"
      },
      render: (props) => <GulmoLetsBeginSection data={props} />
    },

    gulmoConcept: {
      fields: {
        studioName: { type: "text" },
        mainTitle: { type: "text" },
        description: { type: "textarea" },
        jarSectionTitle: { type: "text" },
        jarSectionHeading: { type: "text" },
        categories: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            label: { type: "text" },
            desc: { type: "textarea" },
            img: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { id: 'new', label: 'New Category', desc: 'Description...', img: '' }
        },
        galleryJars: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            subtitle: { type: "text" },
            img: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { id: 'new', title: 'New Jar', subtitle: 'Subtitle...', img: '' }
        }
      },
      defaultProps: {
        studioName: "GULMO BOTANICAL STUDIO",
        mainTitle: "MINIATURE NATURE IN GLASS",
        description: "Gulmo Concept Gardening reimagines indoor greenery...",
        jarSectionTitle: "JAR COLLECTION",
        jarSectionHeading: "EXPLORE OUR BOTANICAL SANCTUARIES",
        categories: [],
        galleryJars: []
      },
      render: (props) => <GulmoConceptSection data={props} />
    },


    // PRAKRITI LAB BLOCKS
    prakritiHero: {
      fields: {
        headlineLines: {
          type: "array",
          arrayFields: { line: { type: "text" } },
          defaultItemProps: { line: "New text line" }
        },
        brushImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        headlineLines: [
          { line: "It is a long" },
          { line: "established" },
          { line: "fact that a" },
          { line: "reader will be" },
          { line: "distracted." }
        ]
      },
      render: (props) => <PrakritiHero data={props} />
    },

    prakritiIntro: {
      fields: {
        brandName: { type: "text" },
        title: { type: "text" },
        description: { 
          type: "custom", 
          render: ({ value, onChange }) => <CollapsibleTiptap label="Description" value={value} onChange={onChange} /> 
        },
        features: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            desc: { type: "textarea" }
          },
          defaultItemProps: { id: '01', title: 'New Feature', desc: 'Description goes here...' }
        }
      },
      defaultProps: {
        brandName: "Prakriti Lab Research",
        title: "Cultivating the Science of Living Ecosystems.",
        description: "Prakriti Lab is NatureCube s experimental sanctuary...",
        features: []
      },
      render: (props) => <PrakritiIntroSection data={props} />
    },

    prakritiEducation: {
      fields: {
        headline: { type: "text" },
        description: { 
          type: "custom", 
          render: ({ value, onChange }) => <CollapsibleTiptap label="Description" value={value} onChange={onChange} /> 
        },
        cards: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "textarea" },
            image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { id: '1', title: 'New Card', image: '' }
        },
        brushBottomImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        headline: "It is a long established fact that a reader will be distracted.",
        description: "At Naturecube, we take students from schools and colleges...",
        cards: []
      },
      render: (props) => <PrakritiEducationSection data={props} />
    },

    prakritiUpcomingWorkshops: {
      fields: {
        heading: { type: "text" },
        subtext: { 
          type: "custom", 
          render: ({ value, onChange }) => <CollapsibleTiptap label="Subtext" value={value} onChange={onChange} /> 
        },
        buttonText: { type: "text" },
        workshops: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { id: '1', title: 'NEW WORKSHOP', image: '' }
        }
      },
      defaultProps: {
        heading: "UPCOMING WORKSHOPS",
        subtext: "It is a long\nestablished fact\nthat a reader will\nbe distracted.",
        buttonText: "Reserve Your Seat",
        workshops: []
      },
      render: (props) => <PrakritiUpcomingWorkshopsSection data={props} {...props} />
    },

    prakritiLabExperience: {
      fields: {
        title: { type: "text" },
        galleryImages: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            src: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { id: '1', title: 'Gallery Image', src: '' }
        },
        testimonials: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            name: { type: "textarea" },
            location: { type: "text" },
            batch: { type: "text" },
            text: { 
              type: "custom", 
              render: ({ value, onChange }) => <CollapsibleTiptap label="Testimonial Text" value={value} onChange={onChange} /> 
            },
            image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { id: '1', name: 'Name', location: '', batch: 'Batch', text: 'Testimonial text...', image: '' }
        }
      },
      defaultProps: {
        title: "PRAKRITI LAB EXPERIENCE",
        galleryImages: [],
        testimonials: []
      },
      render: (props) => <PrakritiLabExperienceSection data={props} />
    },

    prakritiLabShowcase: {
      fields: {
        tagline: { type: "text" },
        title: { type: "text" },
        description: { 
          type: "custom", 
          render: ({ value, onChange }) => <CollapsibleTiptap label="Description" value={value} onChange={onChange} /> 
        },
        showcaseItems: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            category: { type: "text" },
            desc: { type: "textarea" },
            image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { title: 'Item Title', category: 'Category', desc: 'Description...', image: '' }
        }
      },
      defaultProps: {
        tagline: "Laboratory Portfolio",
        title: "Prakriti Lab Experiments",
        description: "Each creation is a meticulously engineered natural ecosystem designed for aesthetic tranquility and low-maintenance longevity.",
        showcaseItems: []
      },
      render: (props) => <PrakritiLabShowcaseSection data={props} />
    },

    prakritiGetInTouch: {
      fields: {
        image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        badgeText: { type: "text" },
        phone: { type: "text" },
        heading: { type: "text" },
        subtext: { 
          type: "custom", 
          render: ({ value, onChange }) => <CollapsibleTiptap label="Subtext" value={value} onChange={onChange} /> 
        }
      },
      defaultProps: {
        badgeText: "Our dedicated team is ready to assist you.",
        phone: "+ 91-9830086975",
        heading: "Get in touch.",
        subtext: "Reach out to us today to schedule your personalized design consultation and start bringing your vision of nature to life."
      },
      render: (props) => <PrakritiGetInTouchSection data={props} />
    },

    prakritiLetsBegin: {
      fields: {
        title: { type: "text" },
        description: { 
          type: "custom", 
          render: ({ value, onChange }) => <CollapsibleTiptap label="Description" value={value} onChange={onChange} /> 
        },
        storeUrl: { type: "text" },
        storeUrlText: { type: "text" },
        btnText: { type: "text" },
        imageMain: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        imageOverlay: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        title: "Let's begin",
        description: "Transform your indoor spaces with living art. Explore our curated collections of botanical aquascapes, terrariums, and custom biomes built by Prakriti Lab.",
        storeUrl: "https://naturecube.store",
        storeUrlText: "naturecube.store",
        btnText: "STORE"
      },
      render: (props) => <PrakritiLetsBeginSection data={props} />
    },

    // WORKSHOP PAGE BLOCKS
    workshopHero: {
      fields: {
        backgroundImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { backgroundImage: '' },
      render: (props) => <WorkshopHero data={props} />
    },

    workshopDetails: {
      fields: {
        title: { type: "text" },
        mentor: { type: "text" },
        date: { type: "text" },
        fee: { type: "text" },
        feeSubtext: { type: "text" },
        buttonText: { type: "text" },
        detailsSubtitle: { type: "text" },
        detailsDescription: { 
          type: "custom", 
          render: ({ value, onChange }) => <CollapsibleTiptap label="Details Description" value={value} onChange={onChange} /> 
        },
        option1Title: { type: "text" },
        option1Items: {
          type: "array",
          arrayFields: { item: { type: "text" } },
          defaultItemProps: { item: "New Option Item" }
        },
        option2Title: { type: "text" },
        option2Items: {
          type: "array",
          arrayFields: { item: { type: "text" } },
          defaultItemProps: { item: "New Option Item" }
        }
      },
      defaultProps: {
        title: "TERRARIUM WORKSHOP",
        mentor: "GAUTAM GUPTA",
        date: "22nd March, 2026",
        fee: "₹ 8500.00",
        feeSubtext: "inclusive of all taxes",
        buttonText: "BOOK NOW",
        detailsSubtitle: "AN ALL-INCLUSIVE WORKSHOP EXPERIENCE",
        detailsDescription: "At Naturecube, we take students from schools and colleges on extensive field tours...",
        option1Title: "DOOA GLASS POT MARU 95",
        option1Items: [{ item: "DOOA GLASS POT MARU 95" }, { item: "DOOA JUNGLE SOIL 700ML" }],
        option2Title: "EXTRA CLEAR CUSTOM TANK",
        option2Items: [{ item: "EXTRA CLEAR CUSTOM TANK" }, { item: "PLANTS & MOSS" }]
      },
      render: (props) => {
        const normalizedProps = {
          ...props,
          option1Items: props.option1Items?.map(obj => typeof obj === 'string' ? obj : obj.item) || [],
          option2Items: props.option2Items?.map(obj => typeof obj === 'string' ? obj : obj.item) || []
        };
        return <WorkshopDetailsSection data={normalizedProps} />;
      }
    },

    workshopGallery: {
      fields: {
        image1: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image2: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image3: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image4: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image5: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
      },
      defaultProps: {
        image1: '', image2: '', image3: '', image4: '', image5: ''
      },
      render: (props) => <WorkshopGallerySection data={props} />
    },

    // ABOUT HORIZONTAL SCROLL BLOCK
    aboutHorizontalScroll: {
      fields: {
        // --- GLOBAL PANORAMIC IMAGE ---
        panoramic_image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // --- HERO PANEL ---
        hero_headlineLine1: { type: "text" },
        hero_headlineLine2: { type: "text" },
        hero_subtext: { type: "custom", render: ({ value, onChange }) => <CollapsibleTiptap label="Hero Subtext" value={value} onChange={onChange} /> },
        hero_yearsExp: { type: "text" },
        hero_sinceYear: { type: "text" },
        hero_clientCount: { type: "text" },

        // --- JOURNEY PANEL ---
        journey_heading: { type: "text" },
        journey_paragraph1: { type: "custom", render: ({ value, onChange }) => <CollapsibleTiptap label="Journey Paragraph 1" value={value} onChange={onChange} /> },
        journey_paragraph2: { type: "custom", render: ({ value, onChange }) => <CollapsibleTiptap label="Journey Paragraph 2" value={value} onChange={onChange} /> },
        journey_bgImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // --- AWARDS PANEL ---
        awards_headingLine1: { type: "text" },
        awards_headingLine2: { type: "text" },
        awards_subtext: { type: "custom", render: ({ value, onChange }) => <CollapsibleTiptap label="Awards Subtext" value={value} onChange={onChange} /> },
        awards_list: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            subtitle: { type: "text" },
            image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          },
          defaultItemProps: { title: "NEW AWARD", subtitle: "Rank 1, 2026", image: "" }
        },

        // --- HISTORY PANEL ---
        history_title: { type: "text" },
        history_smallText: { type: "textarea" },
        history_boldText: { type: "textarea" },
        history_image1: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        history_image2: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // --- SEMINARS PANEL ---
        seminars_year2011Title: { type: "text" },
        seminars_seminarHeading: { type: "text" },
        seminars_seminarText: { type: "textarea" },
        seminars_image1: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        seminars_year2014Title: { type: "text" },
        seminars_cuttakHeading: { type: "text" },
        seminars_cuttakText: { type: "textarea" },
        seminars_image2: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // --- RIPPLES PANEL ---
        ripples_year2015Title: { type: "text" },
        ripples_shopHeading: { type: "text" },
        ripples_shopText: { type: "textarea" },
        ripples_image1: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        ripples_year2016Title: { type: "text" },
        ripples_journalHeading: { type: "text" },
        ripples_image2: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // --- BRANDS PANEL ---
        brands_year2017Title: { type: "text" },
        brands_terrariumHeading: { type: "text" },
        brands_terrariumText: { type: "textarea" },
        brands_image1: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        brands_year2020Title: { type: "text" },
        brands_bringsLine1: { type: "text" },
        brands_bringsLine2: { type: "text" },
        brands_image2: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        brands_year2025Title: { type: "text" },
        brands_centreHeading: { type: "text" },
        brands_image3: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // --- MAIN SHOWCASE IMAGE PANEL ---
        main_image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // --- TEAM PANEL (Gautam Gupta) ---
        team_title: { type: "text" },
        team_statement: { type: "textarea" },
        team_name: { type: "text" },
        team_role: { type: "text" },
        team_description: { type: "custom", render: ({ value, onChange }) => <CollapsibleTiptap label="Team Member Detailed Bio" value={value} onChange={onChange} /> },
        team_image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // --- TEAM MEMBERS PANEL ---
        members_leader1Name: { type: "text" },
        members_leader1Bio: { type: "textarea" },
        members_image1: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        members_leader2Name: { type: "text" },
        members_leader2Bio: { type: "textarea" },
        members_image2: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        members_leader3Name: { type: "text" },
        members_leader3Bio: { type: "textarea" },
        members_image3: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        members_groupImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
      },
      defaultProps: {
        panoramic_image: "",
        hero_headlineLine1: "LOOK DEEP INTO NATURE, AND THEN YOU WILL",
        hero_headlineLine2: "UNDERSTAND EVERYTHING BETTER",
        hero_subtext: "We are evolving the landscape of how nature and science bringing peace in your inner world.",
        hero_yearsExp: "25+",
        hero_sinceYear: "SINCE 2010",
        hero_clientCount: "+100K SATISFIED CLIENTS",
        
        journey_heading: "BORN FROM A CHILDHOOD FASCINATION WITH LOCAL WATERBODIES, NATURECUBE BEGAN AS A PASSION PROJECT ALMOST 40 YEARS AGO.",
        journey_paragraph1: "<p>EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS WITH LEGENDARY AQUARIST TAKASHI AMANO.</p>",
        journey_paragraph2: "<p>WITH A COMMITMENT TO ETHICAL BUSINESS PRACTICES AND KEEPING ENVIRONMENTAL SUSTAINABILITY AT THE CORE.</p>",
        journey_bgImage: "",

        awards_headingLine1: "THE AWARDS WON",
        awards_headingLine2: "BY OUR PROJECTS.",
        awards_subtext: "Evolving from artificial decor to natural aquascaping, our journey was shaped by encounters with legendary aquarist Takashi Amano.",
        awards_list: [],

        history_title: "OUR HISTORY",
        history_smallText: "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING...",
        history_boldText: "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS",
        history_image1: "",
        history_image2: "",

        seminars_year2011Title: "2011",
        seminars_seminarHeading: "FIRST NATURE AQUARIUM SEMINAR ORGANIZED",
        seminars_seminarText: "The Seminar offers lots to both retailers as well as hobbyists.",
        seminars_image1: "",
        seminars_year2014Title: "2014",
        seminars_cuttakHeading: "FIRST PUBLIC AQUARIUM SETUP IN CUTTAK",
        seminars_cuttakText: "Nature Cube plays an active role in setting up a state-of-the-art public aquarium.",
        seminars_image2: "",

        ripples_year2015Title: "2015",
        ripples_shopHeading: "RIPPLES STARTS SHOP",
        ripples_shopText: "RIPPLES, THE RETAIL STORE CUM GALLERY OF NATURE CUBE GETS INAUGURATED.",
        ripples_image1: "",
        ripples_year2016Title: "2016",
        ripples_journalHeading: "RIPPLES FEATURED IN THE ADA AQUA JOURNAL",
        ripples_image2: "",

        brands_year2017Title: "2017",
        brands_terrariumHeading: "TERRARIUM PRODUCTS INTRODUCED",
        brands_terrariumText: "NATURE CUBE STARTS DEALING WITH PRESTIGIOUS TERRARIUM PRODUCTS...",
        brands_image1: "",
        brands_year2020Title: "2020",
        brands_bringsLine1: "NATURE CUBE BRINGS 2 HR AQUARIST TO INDIA",
        brands_bringsLine2: "NATURE CUBE BRINGS OASE TO INDIA",
        brands_image2: "",
        brands_year2025Title: "2025",
        brands_centreHeading: "OPPENSTATE OF THE ART EXPERIENCE CENTRE IN KOLKATA",
        brands_image3: "",

        main_image: "",

        team_title: "OUR TEAM",
        team_statement: "EVOLVING FROM ARTIFICIAL DECOR TO NATURAL AQUASCAPING, OUR JOURNEY WAS SHAPED BY ENCOUNTERS WITH LEGENDARY AQUARIST TAKASHI AMANO.",
        team_name: "GAUTAM GUPTA",
        team_role: "MENTOR",
        team_description: "<p>Gautam Gupta is a committed Nature Advocate, environmental steward...</p>",
        team_image: "",

        members_leader1Name: "COL. BASUDEV MITRA",
        members_leader1Bio: "Colonel Basudev Mitra retired from the army in 2008 after 23 years...",
        members_image1: "",
        members_leader2Name: "PARTHA CHAKRABORTY",
        members_leader2Bio: "Partha, a management graduate with expertise in Telecom Infrastructure...",
        members_image2: "",
        members_leader3Name: "SANJOY DUTTA",
        members_leader3Bio: "He heads the finance team at Naturecube while pursuing his passion...",
        members_image3: "",
        members_groupImage: ""
      },
      render: (props) => <AboutHorizontalScroll data={props} />
    }
  }
};