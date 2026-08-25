export const config = {
  key: "landing-basic",
  version: 1,
  meta: {
    name: "Basic Landing Page",
    description: "A clean, conversion-focused landing page with a Hero, Content area, and Call-to-Action.",
    category: "landing",
    thumbnail: "/default-hero.jpg" // Using an existing asset as placeholder
  },
  sections: [
    {
      key: "hero",
      type: "hero",
      label: "Hero Section",
      fields: [
        { key: "title", type: "text", label: "Headline", required: true, defaultValue: "Welcome to our Platform" },
        { key: "description", type: "richtext", label: "Subtext/Description", defaultValue: "<p>Write your compelling subtext here.</p>" },
        { key: "image", type: "image", label: "Background Image", defaultValue: "" }
      ]
    },
    {
      key: "content",
      type: "content",
      label: "Main Content",
      fields: [
        { key: "heading", type: "text", label: "Section Heading", required: true, defaultValue: "Why Choose Us?" },
        { key: "body", type: "richtext", label: "Body Text", defaultValue: "<p>Detail your features and benefits here.</p>" }
      ]
    },
    {
      key: "cta",
      type: "cta",
      label: "Call To Action",
      fields: [
        { key: "title", type: "text", label: "CTA Title", required: true, defaultValue: "Ready to get started?" },
        { key: "buttonText", type: "text", label: "Button Label", defaultValue: "Contact Us" },
        { key: "buttonLink", type: "text", label: "Button Link", defaultValue: "/contact" }
      ]
    }
  ]
};