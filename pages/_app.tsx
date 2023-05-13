import '@/styles/globals.css'
import supabase from '@/utils/supabase'
import { Auth } from '@supabase/auth-ui-react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Login from './login'
import Register from './register'

type sessionType = {
  access_token: string,
  expires_in: number | undefined,
  refresh_token: string,
  token_type: string,
  user: object
}

export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<sessionType | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (!session) {
    if (router.pathname === '/register') return <Register session={session}/>
    return <Login session={session} />
  }

  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Component {...pageProps} session={session} />
    </Auth.UserContextProvider>
  )
}
