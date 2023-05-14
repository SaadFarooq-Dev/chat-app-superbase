/* eslint-disable react-hooks/exhaustive-deps */
import Loader from "@/components/loader";
import supabase from "@/utils/supabase";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type sessionProps = {
  session: object | null
}

export default function Login({ session }: sessionProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(e.currentTarget));
    if (typeof email === 'string' && typeof password === 'string') {
      const { error } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      )
      if (error) {
        alert(error.message)
        return
      }
      router.push('/')
    }
  }
  const handleLoginUser = async () => {
    if (session) {
      return router.push('/')
    }
    setLoading(false)
  }
  useEffect(() => {
    handleLoginUser()
  }, []);


  if (loading) {
    return <Loader loading={loading} />
  }
  return (
    <div className="flex items-center min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto my-10">
          <div className="text-center">
            <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">Sign in</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to access your account</p>
          </div>
          <div className="m-7">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email Address</label>
                <input type="email" name="email" id="email" placeholder="you@company.com" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" />
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-400">Password</label>
                  <a href="#!" className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-900 dark:hover:text-indigo-300">Forgot password?</a>
                </div>
                <input type="password" name="password" id="password" placeholder="Your Password" className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500" />
              </div>
              <div className="mb-6">
                <button type="submit" className="w-full px-3 py-4 text-white bg-gray-600 rounded-md hover:bg-gray-900 focus:outline-none">Sign in</button>
              </div>
              <p className="text-sm text-center text-gray-400">Don&#x27;t have an account yet? <Link href="/register" className="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-600 dark:focus:border-indigo-800 hover:text-indigo-900">Sign up</Link>.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
