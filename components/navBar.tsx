import supabase from '@/utils/supabase';
import { useRouter } from "next/router";
import { useState } from "react";
import Invite from './invite';

type NavBarProps = {
  roomId: string
}

export default function NavBar({roomId}: NavBarProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      return router.push('/login')
    } catch (error) {
      console.error("Something went wrong!")
      throw new Error('Something went wrong!')
    }
  }
  return (
    <>
      <nav className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
      <div className="font-semibold text-2xl">Chat-App</div>
        <div className="flex gap-3 items-center">
          <Invite roomId={roomId} />
          <div className="h-10 w-10 hover:ring-4 user cursor-pointer relative ring-blue-700/30 rounded-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')]" onClick={() => setIsOpen(!isOpen)}>
            <div className="drop-down  w-48 overflow-hidden bg-white rounded-md shadow absolute top-12 right-3">
              <ul className={`${isOpen ? 'block' : 'hidden'}`} >
                <li className="px-3  py-3 text-sm font-medium flex items-center space-x-2 hover:bg-slate-400">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  <span onClick={handleLogout} > Logout </span>
                </li>

              </ul>
            </div>
          </div>
          <div className="sm:hidden cursor-pointer" id="mobile-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path className="dark:stroke-white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>
      </nav>
    </>
  );
};
