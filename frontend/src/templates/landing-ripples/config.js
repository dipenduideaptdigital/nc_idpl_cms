import rippleBg from "../../assets/nc_home/ripple_bg.png";
export const config = {
  key: "landing-ripples",
  version: 2, // Marked as V2 (Content + Design separation)
  meta: {
    name: "Ripples Premium Layout",
    description: "Full suite design for aquatic and landscape studios.",
    category: "naturecube",
    thumbnail: rippleBg
  },
  sections: [
    {
      key: "hero",
      type: "hero",
      label: "Hero Section",
      
      // WHAT THE CLIENT SAYS
      contentFields: [
        { key: "backgroundImage", type: "image", label: "Background Image", defaultValue: "" },
        { key: "tagline", type: "text", label: "Tagline", defaultValue: "RIPPLES AQUATIC STUDIO" },
        { key: "title", type: "text", label: "Main Title", defaultValue: "LIVING ART UNDER WATER" },
        { key: "description", type: "textarea", label: "Description", defaultValue: "Experience the tranquility of nature right inside your spaces." }
      ],
      // ==== HOW IT LOOKS (Visuals) ====
      designFields: [
        { 
          key: "heroStyles", 
          type: "styleBuilder", 
          label: "CSS Section",
          cssCheatSheet: `/* Available Classes to Target: */
.nc-hero-section     { /* Main wrapper */ }
.nc-hero-tagline     { /* Top small text */ }
.nc-hero-title       { /* Main big headline */ }
.nc-hero-description { /* Subtext paragraph */ }
.nc-hero-btn         { /* The Explore button */ }`
        }
      ]
    },
    {
      key: "intro",
      type: "intro",
      label: "Intro & Quote Section",
      contentFields: [
        { key: "mainTitle", type: "textarea", label: "Main Title", defaultValue: "It is a long established fact that a reader will be distracted." },
        { key: "subTitle", type: "text", label: "Subtitle", defaultValue: "Founded in 2014 with a vision of promoting ethical fish keeping." },
        { key: "description", type: "richtext", label: "Description", defaultValue: "<p>Ripples brings over 40 years of expertise to hobbyists in Kolkata and India...</p>" },
        { key: "personImage", type: "image", label: "Author/Person Image", defaultValue: "" },
        { key: "quote", type: "textarea", label: "Quote Text", defaultValue: "“To know Mother Nature is to love her smallest creations.”" },
        { key: "authorName", type: "text", label: "Author Name", defaultValue: "–Takashi Amano" }
      ],
      designFields: [
        { 
          key: "introStyles", 
          type: "styleBuilder", 
          label: "Intro CSS",
          cssCheatSheet: `/* Available Classes to Target: */\n.nc-intro-section { /* Main white background wrapper */ }\n.nc-intro-maintitle { /* Large heading on the left */ }\n.nc-intro-subtitle { /* Smaller heading on the right */ }\n.nc-intro-desc { /* Description text */ }\n.nc-intro-btn { /* Explore button */ }\n.nc-intro-bottom-banner { /* Bottom dark banner wrapper */ }\n.nc-intro-quote { /* Blockquote text */ }\n.nc-intro-author { /* Author name below quote */ }`
        }
      ]
    },
  ]
};