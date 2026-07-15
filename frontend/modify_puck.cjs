const fs = require('fs');
const file = 'c:/Users/nk845/OneDrive/Desktop/Nadeem_/Subhaakritee/frontend/src/config/puck.config.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /import ContactFormBlock from '\.\.\/components\/blocks\/ContactFormBlock';/g,
  "import ContactFormBlock from '../components/blocks/ContactFormBlock';\nimport ImageField from '../components/admin/ImageField';"
);

// Replace all image-like fields
const regex = /(backgroundImage|frontImage|image|bottomImage|authorImage):\s*\{\s*type:\s*"text"\s*\}/g;
content = content.replace(regex, (match, fieldName) => {
  return `${fieldName}: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> }`;
});

const arrayRegex = /image:\s*\{\s*type:\s*"text"\s*\}/g;
content = content.replace(arrayRegex, `image: { type: "custom", render: ({ onChange, value }) => <ImageField value={value} onChange={onChange} /> }`);

fs.writeFileSync(file, content);
console.log('Done');