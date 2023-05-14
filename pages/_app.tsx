import Loader from '@/components/loader'
import '@/styles/globals.css'
import supabase from '@/utils/supabase'
import { Auth } from '@supabase/auth-ui-react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type sessionType = {
  access_token: string,
  expires_in: number | undefined,
  refresh_token: string,
  token_type: string,
  user: object
}

export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<sessionType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Loader loading={loading} />
  }

  return (
    <Auth.UserContextProvider session={session} supabaseClient={supabase}>
      <Component {...pageProps} session={session} />
    </Auth.UserContextProvider>
  )
}
