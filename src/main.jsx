import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

function getValidClerkKey() {
  const envKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  if (!envKey) return 'pk_test_Z2FtZS1veXN0ZXItMzkuY2xlcmsuYWNjb3VudHMuZGV2JA';

  // Safely check if the Base64 encoded domain in the key points to unconfigured CNAME DNS
  try {
    const base64Part = envKey.replace(/^pk_(live|test)_/, '');
    const decodedDomain = atob(base64Part);
    if (decodedDomain.includes('clerk.tg-radar-neon.vercel.app')) {
      console.warn('Clerk publishable key points to an unconfigured CNAME domain. Using fallback active key.');
      return 'pk_test_Z2FtZS1veXN0ZXItMzkuY2xlcmsuYWNjb3VudHMuZGV2JA';
    }
  } catch (e) {
    // If decoding fails, continue with envKey
  }

  return envKey;
}

const PUBLISHABLE_KEY = getValidClerkKey();
const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      signInFallbackRedirectUrl={currentOrigin}
      signUpFallbackRedirectUrl={currentOrigin}
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorPrimary: '#005bf8',
          colorBackground: '#ffffff',
          colorText: '#1b2045',
          colorTextSecondary: '#787878',
          borderRadius: '0.85rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
        elements: {
          rootBox: 'flex justify-center items-center',
          cardBox: 'w-[440px] max-w-[90vw] shadow-2xl border border-[#e9e9e9] rounded-[28px] overflow-hidden bg-white',
          card: 'p-8 shadow-none border-none bg-transparent',
          header: 'mb-6 text-center pr-4',
          headerTitle: 'text-2xl font-black text-[#1b2045] tracking-tight',
          headerSubtitle: 'text-xs text-[#787878] mt-1',
          modalCloseButton: 'top-5 right-5 text-[#787878] hover:text-[#1b2045] transition-colors p-1.5 rounded-full hover:bg-[#f0f4ff]',
          formButtonPrimary: 'bg-[#005bf8] hover:bg-[#004cd4] text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm',
          formFieldInput: 'rounded-xl border border-gray-200 focus:border-[#005bf8] focus:ring-2 focus:ring-[#005bf8]/20 transition-all text-sm py-2.5 px-3.5',
          socialButtonsBlockButton: 'rounded-xl border border-gray-200 hover:border-[#005bf8] hover:bg-[#f0f4ff]/50 transition-all font-semibold text-xs py-2.5',
          footer: 'border-t border-gray-100 mt-6 pt-4 text-center',
          footerActionText: 'text-xs text-[#787878]',
          footerActionLink: 'text-xs font-bold text-[#005bf8] hover:underline ml-1'
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
