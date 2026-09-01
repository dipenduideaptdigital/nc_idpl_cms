import React, { useState, useEffect } from 'react';
import { Edit2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import TipTapEditor from '../components/admin/TipTapEditor';
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
import MandalaHorizontalScroll from '../components/nc_mandala/MandalaHorizontalScroll';
import NcProjectsHero from '../components/nc_projects/NcProjectsHero';
import { dynamicFormsApi } from '../api/dynamicForms';
import DynamicFormRenderer from '../components/dynamic-forms/DynamicFormRenderer';

// --- DYNAMIC FORM SELECTOR COMPONENT FOR PUCK ---
const FormSelectorField = ({ value, onChange }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dynamicFormsApi.getPublishedFormsList()
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setForms(res.data);
        }
      })
      .catch(err => console.error("Failed to load forms for Puck dropdown", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-xs text-zinc-400 py-2">Loading forms list...</div>;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Dynamic Form</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select a Form</option>
        {forms.map(form => (
          <option key={form.id} value={form.slug}>
            {form.title} (slug: {form.slug})
          </option>
        ))}
      </select>
      {forms.length === 0 && (
        <p className="text-[11px] text-amber-600 mt-1">No published forms found. Please publish a form first.</p>
      )}
    </div>
  );
};

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

// Puck Custom Visibility Toggle
const VisibilityToggle = ({ value, onChange }) => {
  const isVisible = value !== false;
  return (
    <div className={`mb-4 p-2.5 rounded-lg border transition-colors duration-300 flex items-center justify-between ${isVisible ? 'bg-blue-50/50 border-blue-200/60' : 'bg-zinc-50 border-zinc-200/60'}`}>
      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-md transition-colors duration-300 ${isVisible ? 'bg-blue-100 text-blue-600' : 'bg-zinc-200 text-zinc-500'}`}>
          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </div>
        <span className={`text-sm font-semibold transition-colors duration-300 ${isVisible ? 'text-blue-900' : 'text-zinc-500'}`}>
          Visible on Website
        </span>
      </div>
      <label className="flex items-center cursor-pointer relative shrink-0 mr-1">
        <input 
          type="checkbox" 
          checked={isVisible} 
          onChange={(e) => onChange(e.target.checked)} 
          className="sr-only" 
        />
        <div className={`w-9 h-5 rounded-full transition-colors duration-300 shadow-inner ${isVisible ? 'bg-blue-500' : 'bg-zinc-300'}`}></div>
        <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${isVisible ? 'transform translate-x-4' : 'transform translate-x-0'}`}></div>
      </label>
    </div>
  );
};

export const ncPuckConfig = {
  components: {

    // GENERIC BLOCKS
    dynamicButton: {
      fields: {
        label: { type: "text" },
        actionType: {
          type: "radio",
          options: [
            { label: "Standard Link", value: "link" },
            { label: "Open Form Modal", value: "modal" }
          ]
        },
        url: { type: "text" },
        formSlug: {
          type: "custom",
          render: ({ value, onChange }) => <FormSelectorField value={value} onChange={onChange} />
        },
        alignment: {
          type: "radio",
          options: [
            { label: "Left", value: "justify-start" },
            { label: "Center", value: "justify-center" },
            { label: "Right", value: "justify-end" }
          ]
        }
      },
      defaultProps: {
        label: "Click Here",
        actionType: "modal",
        url: "/",
        formSlug: "",
        alignment: "justify-center"
      },
      render: (props) => {
        const handleClick = (e) => {
          if (props.actionType === 'modal') {
            e.preventDefault(); 
            if (props.formSlug) {
              window.dispatchEvent(new CustomEvent('open-dynamic-form', { 
                detail: { slug: props.formSlug } 
              }));
            } else {
              alert("No form selected for this button.");
            }
          }
        };

        return (
          <div className={`w-full py-8 px-6 flex ${props.alignment}`}>
            <a 
              href={props.actionType === 'link' ? props.url : '#'} 
              onClick={handleClick}
              className="bg-[#7BA641] hover:bg-[#6b9337] text-white font-kanit font-semibold tracking-wider text-sm uppercase px-8 py-3.5 rounded-md shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              {props.label}
            </a>
          </div>
        );
      }
    },

    contactForm: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        formSlug: {
          type: "custom",
          render: ({ value, onChange }) => <FormSelectorField value={value} onChange={onChange} />
        },
        formTitle: { type: "text" },
      },
      defaultProps: {
        isVisible: true,
        formSlug: "",
        formTitle: "Get in Touch"
      },
      render: (props) => {
        if (props.isVisible === false) {
          return <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Contact Form Block</div>;
        }
        if (!props.formSlug) {
          return (
            <div className="p-8 bg-zinc-900 text-zinc-300 text-center border border-zinc-700 rounded-xl">
              <p className="font-semibold">Dynamic Form Block</p>
              <p className="text-xs text-zinc-400 mt-1">Please select a published form from the right sidebar configuration.</p>
            </div>
          );
        }
        return (
          <div className="py-12 px-6 max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-zinc-200">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900">{props.formTitle}</h2>
            <DynamicFormRenderer slug={props.formSlug} />
          </div>
        );
      }
    },

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


    getStartedCta: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        title: { type: "textarea" },
        buttonText: { type: "text" }
      },
      defaultProps: {
        isVisible: true,
        title: 'Ready to build your dream aquarium?',
        buttonText: 'Get Started'
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: CTA Section</div> : <GetStartedCtaSection data={props} />
    },


    // RIPPLES PAGE BLOCKS
    ripplesHero: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        backgroundImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { isVisible: true, backgroundImage: '' },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Ripples Hero</div> : <RipplesHero data={props} />
    },

    ripplesIntro: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        mainTitle: 'It is a long established fact that a reader will be distracted.',
        subTitle: 'It is a long established fact that a reader will be distracted.',
        description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India. Specializing in setting up Nature Aquariums and Biotopes that mimic actual fish habitats, we offer international quality brands and exceptional customer service, helping you build and maintain your dream aquarium.',
        personImage: '',
        quote: '“To know Mother Nature is to love her smallest creations.”',
        authorName: '–Takashi Amano'
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Ripples Intro</div> : <RipplesIntroSection data={props} />
    },

    ripplesNatureAquarium: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        section1Title: 'What is Nature Aquarium?',
        card1Image: '',
        card1Title: 'It is a long established fact that a reader will be distracted.',
        card1Description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.',
        section2Title: 'OUR PROJECTS',
        section2Description: 'Founded in 2014 with a vision of promoting ethical fish keeping, Ripples brings over 40 years of expertise to hobbyists in Kolkata and India.',
        card2Image: '',
        card2Caption: 'It is a long established fact that a reader will be distracted.'
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Nature Aquarium</div> : <RipplesNatureAquariumSection data={props} />
    },

    ripplesLetsBegin: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
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
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Ripples Let's Begin</div> : <RipplesLetsBeginSection data={props} />
    },

    ripplesAquascape: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
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
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Ripples Aquascape</div> : <RipplesAquascapeSection data={props} />
    },


    // GULMO PAGE BLOCKS
    gulmoHero: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        backgroundImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { isVisible: true, backgroundImage: '' },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Gulmo Hero</div> : <GulmoHero data={props} />
    },

    gulmoTerrarium: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        cat1Title: 'Terrariums',
        cat1Desc: 'Elevate your indoor spaces with lush, green gardens...',
        cat2Title: 'Paludariums',
        cat2Desc: 'Experience the best of both worlds with our paludariums...',
        cat3Title: 'Indoor Gardens',
        cat3Desc: 'Transform any space with our custom-designed aquariums...'
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Gulmo Terrarium</div> : <GulmoTerrariumSection data={props} />
    },

    gulmoQuote: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        bgImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        quoteIcon: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        quoteText: { type: "textarea" },
        quoteAuthor: { type: "text" }
      },
      defaultProps: {
        isVisible: true,
        quoteText: "The forest is a peculiar organism of unlimited kindness and benevolence that makes no demands for its sustenance...",
        quoteAuthor: "Gautama Buddha"
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Gulmo Quote</div> : <GulmoQuoteSection data={props} />
    },

    gulmoForestOrganism: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        mainTitle: "The Forest Is A Peculiar Organism",
        f1Label: "GLASS", f1Title: "GLASS: TOP CASE", f1Desc: "A tall glass cover...",
        f2Label: "LIGHTING", f2Title: "LIGHTING SYSTEM", f2Desc: "High-spectrum LED...",
        f3Label: "PLANTS", f3Title: "PLANTS & FLORA", f3Desc: "Lush evergreen mosses...",
        f4Label: "TERRA BASE", f4Sub: "PLATE", f4Title: "TERRA BASE", f4Desc: "Cylindrical porous...",
        f5Label: "SUBSTRATE", f5Title: "SUBSTRATE & SOIL", f5Desc: "Multi-layered nutrient...",
        f6Label: "TOOL", f6Sub: "MAINTENANCE", f6Title: "LAYOUT TOOL", f6Desc: "Precision tools..."
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Gulmo Forest Organism</div> : <GulmoForestOrganismSection data={props} />
    },

    gulmoOurProjects: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        title: { type: "text" },
        description: { type: "textarea" },
        bgSplash: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        imageLeft: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        imageRight: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        isVisible: true,
        title: "OUR PROJECTS",
        description: "Founded in 2014 with a vision of promoting ethical fish keeping..."
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Gulmo Our Projects</div> : <GulmoOurProjectsSection data={props} />
    },

    gulmoLetsBegin: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        title: { type: "text" },
        description: { type: "textarea" },
        storeUrl: { type: "text" },
        storeUrlText: { type: "text" },
        btnText: { type: "text" },
        imageMain: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        imageOverlay: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        isVisible: true,
        title: "Let's begin",
        description: "Founded in 2014 with a vision...",
        storeUrl: "https://naturecube.store",
        storeUrlText: "naturecube.store",
        btnText: "STORE"
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Gulmo Let's Begin</div> : <GulmoLetsBeginSection data={props} />
    },

    gulmoConcept: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        studioName: "GULMO BOTANICAL STUDIO",
        mainTitle: "MINIATURE NATURE IN GLASS",
        description: "Gulmo Concept Gardening reimagines indoor greenery...",
        jarSectionTitle: "JAR COLLECTION",
        jarSectionHeading: "EXPLORE OUR BOTANICAL SANCTUARIES",
        categories: [],
        galleryJars: []
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Gulmo Concept</div> : <GulmoConceptSection data={props} />
    },


    // PRAKRITI LAB BLOCKS
    prakritiHero: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        headlineLines: {
          type: "array",
          arrayFields: { line: { type: "text" } },
          defaultItemProps: { line: "New text line" }
        },
        brushImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        isVisible: true,
        headlineLines: [
          { line: "It is a long" },
          { line: "established" },
          { line: "fact that a" },
          { line: "reader will be" },
          { line: "distracted." }
        ]
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Prakriti Hero</div> : <PrakritiHero data={props} />
    },

    prakritiIntro: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        brandName: "Prakriti Lab Research",
        title: "Cultivating the Science of Living Ecosystems.",
        description: "Prakriti Lab is NatureCube s experimental sanctuary...",
        features: []
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Prakriti Intro</div> : <PrakritiIntroSection data={props} />
    },

    prakritiEducation: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        headline: "It is a long established fact that a reader will be distracted.",
        description: "At Naturecube, we take students from schools and colleges...",
        cards: []
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Prakriti Education</div> : <PrakritiEducationSection data={props} />
    },

    prakritiUpcomingWorkshops: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        heading: "UPCOMING WORKSHOPS",
        subtext: "It is a long\nestablished fact\nthat a reader will\nbe distracted.",
        buttonText: "Reserve Your Seat",
        workshops: []
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Prakriti Workshops</div> : <PrakritiUpcomingWorkshopsSection data={props} {...props} />
    },

    prakritiLabExperience: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        title: "PRAKRITI LAB EXPERIENCE",
        galleryImages: [],
        testimonials: []
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Prakriti Lab Experience</div> : <PrakritiLabExperienceSection data={props} />
    },

    prakritiLabShowcase: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        tagline: "Laboratory Portfolio",
        title: "Prakriti Lab Experiments",
        description: "Each creation is a meticulously engineered natural ecosystem designed for aesthetic tranquility and low-maintenance longevity.",
        showcaseItems: []
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Prakriti Lab Showcase</div> : <PrakritiLabShowcaseSection data={props} />
    },

    prakritiGetInTouch: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        badgeText: "Our dedicated team is ready to assist you.",
        phone: "+ 91-9830086975",
        heading: "Get in touch.",
        subtext: "Reach out to us today to schedule your personalized design consultation and start bringing your vision of nature to life."
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Prakriti Get In Touch</div> : <PrakritiGetInTouchSection data={props} />
    },

    prakritiLetsBegin: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
        title: "Let's begin",
        description: "Transform your indoor spaces with living art. Explore our curated collections of botanical aquascapes, terrariums, and custom biomes built by Prakriti Lab.",
        storeUrl: "https://naturecube.store",
        storeUrlText: "naturecube.store",
        btnText: "STORE"
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Prakriti Let's Begin</div> : <PrakritiLetsBeginSection data={props} />
    },

    // WORKSHOP PAGE BLOCKS
    workshopHero: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        backgroundImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: { isVisible: true, backgroundImage: '' },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Workshop Hero</div> : <WorkshopHero data={props} />
    },

    workshopDetails: {
      fields: {
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
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
        isVisible: true,
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
        if (props.isVisible === false) {
          return <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Workshop Details</div>;
        }
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
        isVisible: { type: "custom", render: ({ value, onChange }) => <VisibilityToggle value={value} onChange={onChange} /> },
        image1: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image2: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image3: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image4: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        image5: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
      },
      defaultProps: {
        isVisible: true,
        image1: '', image2: '', image3: '', image4: '', image5: ''
      },
      render: (props) => props.isVisible === false ? <div className="p-6 bg-red-50 text-red-500 text-center font-bold border-2 border-red-200 border-dashed rounded-xl">Hidden: Workshop Gallery</div> : <WorkshopGallerySection data={props} />
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
    },

    // MANDALA HORIZONTAL SCROLL BLOCK
    mandalaHorizontalScroll: {
      fields: {
        panoramic_image: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // Panel 1
        p1_title: { type: "text" },
        p1_subLine1: { type: "text" },
        p1_subLine2: { type: "text" },
        p1_subItalic: { type: "text" },
        p1_rightTitle: { type: "text" },
        p1_rightDesc: { type: "custom", render: ({ value, onChange }) => <CollapsibleTiptap label="Panel 1 Right Description" value={value} onChange={onChange} /> },
        p1_quote: { type: "textarea" },
        p1_mandalaImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        p1_mountainImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // Panel 2
        p2_titleLine1: { type: "text" },
        p2_titleLine2: { type: "text" },
        p2_desc1: { type: "custom", render: ({ value, onChange }) => <CollapsibleTiptap label="Panel 2 Description 1" value={value} onChange={onChange} /> },
        p2_desc2: { type: "custom", render: ({ value, onChange }) => <CollapsibleTiptap label="Panel 2 Description 2" value={value} onChange={onChange} /> },
        p2_patternImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        p2_branchImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },

        // Panel 3
        p3_title: { type: "text" },
        p3_desc: { type: "custom", render: ({ value, onChange }) => <CollapsibleTiptap label="Panel 3 Description" value={value} onChange={onChange} /> },
        p3_tagline1: { type: "text" },
        p3_tagline2: { type: "text" },
        p3_mandalaImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> },
        p3_fishImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        panoramic_image: "",
        
        p1_title: "LIVING MANDALAS",
        p1_subLine1: "A quest to",
        p1_subLine2: "expose the principles of",
        p1_subItalic: "mandala",
        p1_rightTitle: "mandalas",
        p1_rightDesc: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
        p1_quote: "This eternal circle of life is playing constantly in and around us.",
        p1_mandalaImage: "",
        p1_mountainImage: "",

        p2_titleLine1: "elements of",
        p2_titleLine2: "balance",
        p2_desc1: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
        p2_desc2: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>",
        p2_patternImage: "",
        p2_branchImage: "",

        p3_title: "elements of balance",
        p3_desc: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
        p3_tagline1: "LIQUID LANDSCAPES MIRRORED IN MINDFUL ART,",
        p3_tagline2: "A LIVING MANDALA'S HEART.",
        p3_mandalaImage: "",
        p3_fishImage: ""
      },
      render: (props) => <MandalaHorizontalScroll data={props} />
    },

    projectsBanner: {
      fields: {
        title: { type: "textarea" },
        backgroundImage: { type: "custom", render: ({ value, onChange }) => <ImageField value={value} onChange={onChange} /> }
      },
      defaultProps: {
        title: "Projects",
        backgroundImage: ""
      },
      render: (props) => <NcProjectsHero data={props} />
    }
  }
};