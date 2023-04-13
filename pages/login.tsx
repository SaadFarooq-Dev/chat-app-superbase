import supabase from "@/utils/supabase";
import { useRouter } from "next/router";

export default function Login (){
  const router = useRouter();
  const handleSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {email,password} =  Object.fromEntries(new FormData(e.currentTarget));
    if (typeof email === 'string' && typeof password === 'string' ){
      const {error} = await supabase.auth.signInWithPassword(
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

  return (
    <div className="mx-auto min-w-full flex justify-center items-center max-w-2xl min-h-screen">
    {/* <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} /> */}
<form onSubmit={handleSubmit}>
  <div className="mb-6">
    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
    <input type="email" id="email" name='email' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required />
  </div>
  <div className="mb-6">
    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
    <input type="password" id="password" name='password' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
  </div>
   <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign In</button>
  </form>
</div>
  )
}
