import '@/styles/globals.css'
import supabase from '@/utils/supabase'
import { Auth } from '@supabase/auth-ui-react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </Auth.UserContextProvider>
  )
}
