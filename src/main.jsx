import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const envKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const PUBLISHABLE_KEY = (envKey && envKey.startsWith('pk_live_'))
  ? envKey
  : 'pk_live_Y2xlcmsudGctcmFkYXItbmVvbi52ZXJjZWwuYXBwJA';
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
          formButtonPrimary: 'bg-[#005bf8] hover:bg-[#0047c9] text-white font-extrabold text-xs py-3.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full mt-2',
          socialButtonsBlockButton: 'border border-[#e9e9e9] hover:bg-[#f0f4ff] hover:border-[#005bf8]/30 transition-all rounded-full font-bold text-xs py-2.5 text-[#1b2045]',
          formFieldInput: 'rounded-xl border-[#e9e9e9] focus:border-[#005bf8] focus:ring-2 focus:ring-[#005bf8]/20 transition-all text-xs font-medium py-3 px-4',
          footerActionLink: 'text-[#005bf8] font-bold hover:underline ml-1',
          footer: 'bg-[#fafafa] border-t border-[#f0f0f0] rounded-b-[28px] py-4 px-8 text-center',
          footerPagesLink: 'text-[#005bf8]',
          dividerLine: 'bg-[#e9e9e9]',
          dividerText: 'text-[10px] text-[#aaa] font-bold uppercase tracking-wider',
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)





