import MessagesAnon from "@/components/messagesAnon";
import supabase from "@/utils/supabase";
import { useRouter } from "next/router";

export default function AnonMessage() {
  const router = useRouter();

  return (

    <div className='flex h-screen flex-col items-center justify-center py-2'>
      <main className="flex w-full h-full flex-1 flex-col items-center px-20">
        <h1 className='text-4xl animate-pulse px-4 py-2'>Chat App</h1>
          <MessagesAnon />
      </main>
    </div>


  )
}
