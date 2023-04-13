import Head from "@/components/hello";
import MessageForm from "@/components/messageForm";
import Messages from "@/components/messages";
import supabase from "@/utils/supabase";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Room() {
  const router = useRouter();
  const roomId = router.query.id as string;

  const handleInvite = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const { data } = await supabase.from('profiles').select('id').match({ username: (e.target as HTMLTextAreaElement).value }).single()
      if (!data) {
        return alert('No user Found')
      }
      const { error } = await supabase.from('room_participants').insert({ profile_id: data.id, room_id: roomId })
      if (error) {
        alert(error.message)
      }
      (e.target as HTMLTextAreaElement).value = ''
      return alert ("User invited")
    }
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center py-2'>
      <Head />
      <main className="flex w-full h-full flex-1 flex-col items-center px-20">
        <div className="w-full flex justify-between max-h-14 px-2 py-3">
          <h1 className='text-4xl'><Link href={'/'}>Chat App</Link></h1>
          <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onKeyDown={handleInvite} />
        </div>
        <div className='overflow-y-scroll w-full'>
          {roomId && <Messages roomId={roomId} />}
        </div>
        <div className='w-full p-2 my-5'>
          <MessageForm roomId={roomId} />
        </div>
      </main>
    </div>
  )
}
