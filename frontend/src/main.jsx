// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { AuthProvider } from './context/AuthContext.jsx'
// import { ThemeProvider } from './context/ThemeContext.jsx'
// import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

// createRoot(document.getElementById('root')).render(
//   <AuthProvider>
//     <ThemeProvider>
//       <GoogleReCaptchaProvider
//         reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "dummy_key"}
//         scriptProps={{
//           async: false,
//           defer: false,
//           appendTo: "head",
//           nonce: undefined,
//         }}
//       >
//         <App />
//       </GoogleReCaptchaProvider>
//     </ThemeProvider>
//   </AuthProvider>
// )
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import App from './App.jsx';

import { store } from './app/store';

import AuthInitializer from './features/auth/AuthInitializer';
import ThemeSync from './features/theme/ThemeSync';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthInitializer>
      <ThemeSync>
        <GoogleReCaptchaProvider
          reCaptchaKey={
            import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
            'dummy_key'
          }
          scriptProps={{
            async: false,
            defer: false,
            appendTo: 'head',
            nonce: undefined,
          }}
        >
          <App />
        </GoogleReCaptchaProvider>
      </ThemeSync>
    </AuthInitializer>
  </Provider>
);