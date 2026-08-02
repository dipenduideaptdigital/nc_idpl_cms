import React, { useState } from 'react';
import { Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import TipTapEditor from '../components/admin/TipTapEditor';
import ContactFormBlock from '../components/blocks/ContactFormBlock';
import ImageField from '../components/admin/ImageField';

// Import Ripple
import RipplesHero from '../components/ripples/RipplesHero';
import RipplesIntroSection from '../components/ripples/RipplesIntroSection';
import RipplesNatureAquariumSection from '../components/ripples/RipplesNatureAquariumSection';
import RipplesLetsBeginSection from '../components/ripples/RipplesLetsBeginSection';
import RipplesAquascapeSection from '../components/ripples/RipplesAquascapeSection';
import GetStartedCtaSection from '../components/nature_homepage/GetStartedCtaSection';

// Import Gulmo 
import GulmoHero from '../components/gulmo/GulmoHero';
import GulmoTerrariumSection from '../components/gulmo/GulmoTerrariumSection';
import GulmoQuoteSection from '../components/gulmo/GulmoQuoteSection';
import GulmoForestOrganismSection from '../components/gulmo/GulmoForestOrganismSection';
import GulmoOurProjectsSection from '../components/gulmo/GulmoOurProjectsSection';
import GulmoLetsBeginSection from '../components/gulmo/GulmoLetsBeginSection';
import GulmoConceptSection from '../components/gulmo/GulmoConceptSection';

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
        description: { type: "textarea" },
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
          defaultItemProps: { num: '01', title: 'Step Title', description: 'Step description', img: '' }
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
          defaultItemProps: { img: '', caption: 'Caption' }
        }
      },
      defaultProps: {
        subtitle: 'RIPPLES AQUATIC STUDIO',
        title: 'LIVING ART UNDER WATER',
        description: 'At Ripples Aquatic Studio, we engineer pristine underwater ecosystems that bring tranquility, life, and architectural grandeur into your space. From high-tech Dutch aquascapes to low-maintenance biotope environments, each installation is a handcrafted living masterpiece.',
        categories: [
          { id: 'nature', label: 'Nature Aquariums', desc: 'Captivating underwater landscapes styled after natural forests, mountains, and valleys with vibrant living plants.', img: '' },
          { id: 'biotope', label: 'Low-Maintenance Biotopes', desc: 'Authentic habitat recreations tailored for easy maintenance while mirroring natural rivers and aquatic ecosystems.', img: '' },
          { id: 'hardscape', label: 'Custom Hardscapes', desc: 'Artisanal stone structures, fossil wood, and natural driftwood scapes crafted as permanent interior focal points.', img: '' },
          { id: 'paludarium', label: 'Paludariums & Ripariums', desc: 'Seamlessly blending underwater aquatic realms with lush above-water terrarium plant growth.', img: '' }
        ],
        gallerySubtitle: 'GALLERY SHOWCASE',
        galleryTitle: 'CRAFTED WITH PRECISION & PASSION',
        galleries: [
          { img: '', caption: 'Nature Aquarium Hardscape' },
          { img: '', caption: 'High Precision CO2 Plant System' },
          { img: '', caption: 'Custom Architectural Tank Fitments' }
        ]
      },
      render: (props) => <RipplesAquascapeSection data={props} />
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

    gulmoHero: {
      fields: {
        backgroundImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { backgroundImage: '' },
      render: (props) => <GulmoHero data={props} />
    },

    gulmoTerrarium: {
      fields: {
        // Main Jar
        mainJarImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        
        // Category 1
        cat1Title: { type: "text" },
        cat1Desc: { type: "textarea" },
        cat1Icon: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        
        // Category 2
        cat2Title: { type: "text" },
        cat2Desc: { type: "textarea" },
        cat2Icon: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        
        // Category 3
        cat3Title: { type: "text" },
        cat3Desc: { type: "textarea" },
        cat3Icon: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // Bottom Jars
        bottomJar1: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        bottomJar2: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        bottomJar3: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        bottomJar4: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
      },
      defaultProps: {
        cat1Title: 'Terrariums',
        cat1Desc: 'Elevate your indoor spaces with lush, green gardens tailored to thrive in various home environments, promoting health and well-being.',
        cat2Title: 'Paludariums',
        cat2Desc: 'Experience the best of both worlds with our paludariums, which combine aquatic and terrestrial elements to create a unique and captivating display.',
        cat3Title: 'Indoor Gardens',
        cat3Desc: 'Transform any space with our custom-designed aquariums that mimic natural aquatic ecosystems, providing a stunning visual and calming presence.'
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
        quoteText: "The forest is a peculiar organism of unlimited kindness and benevolence that makes no demands for its sustenance and extends generously the products of its life activity; it affords protection to all beings, offering shade even to the axe-man who destroys it.",
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
        f1Label: "GLASS", f1Title: "GLASS: TOP CASE", f1Desc: "A tall glass cover with ventilation holes that maintains high humidity and temperature.",
        f2Label: "LIGHTING SYSTEM", f2Title: "LIGHTING SYSTEM", f2Desc: "High-spectrum LED lighting engineered specifically to support photosynthesis and vibrant plant growth.",
        f3Label: "PLANTS", f3Title: "PLANTS & FLORA", f3Desc: "Lush evergreen mosses, miniature ferns, and humidity-retaining species crafted for long-term health.",
        f4Label: "TERRA BASE", f4Sub: "TERRA PLATE", f4Title: "TERRA BASE & TERRA PLATE", f4Desc: "Cylindrical porous ceramic base supplying continuous hydration through natural water evaporation.",
        f5Label: "SUBSTRATE", f5Title: "SUBSTRATE & SOIL", f5Desc: "Multi-layered nutrient substratum optimized for root breathability and balanced moisture retention.",
        f6Label: "LAYOUT &", f6Sub: "MAINTENANCE TOOL", f6Title: "LAYOUT & MAINTENANCE TOOL", f6Desc: "Precision aquascaping tools for delicate planting, trimming, and pin-point maintenance."
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
        description: "Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India."
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
        description: "Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.",
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
          }
        },
        galleryJars: {
          type: "array",
          arrayFields: {
            id: { type: "text" },
            title: { type: "text" },
            subtitle: { type: "text" },
            img: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
          }
        }
      },
      defaultProps: {
        studioName: "GULMO BOTANICAL STUDIO",
        mainTitle: "MINIATURE NATURE IN GLASS",
        description: "Gulmo Concept Gardening reimagines indoor greenery through handcrafted living terrariums, enclosed ecosystems, and bespoke botanical installations. Each creation balances humidity, light, and natural substrata to form self-sustaining indoor habitats.",
        jarSectionTitle: "JAR COLLECTION",
        jarSectionHeading: "EXPLORE OUR BOTANICAL SANCTUARIES",
        categories: [],
        galleryJars: []
      },
      render: (props) => <GulmoConceptSection data={props} />
    },
  }
};