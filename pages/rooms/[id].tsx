import Head from "@/components/hello";
import MessageForm from "@/components/messageForm";
import Messages from "@/components/messages";
import { supabase } from "@supabase/auth-ui-shared";
import { useRouter } from "next/router";

export default function Room (){
  const router = useRouter();
  const roomId = router.query.id as string;

  return (
    <div className='flex h-screen flex-col items-center justify-center py-2'>
      <Head />
      <main className="flex w-full h-full flex-1 flex-col items-center px-20">
        <h1 className='text-4xl px-4 py-2'>Chat App </h1>
        <div className='overflow-y-scroll w-full'>
          {roomId && <Messages roomId={roomId}/>}
        </div>
        <div className='w-full p-2 my-5'>
          <MessageForm roomId={roomId}/>
        </div>
      </main>
    </div>
  )
}
