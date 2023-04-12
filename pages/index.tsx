import Head from '@/components/hello'
import MessageForm from '@/components/messageForm'
import Messages from '@/components/messages'
import supabase from '@/utils/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Room = {
  id: string,
  name: string | null,
  created_at: string,
}

export default function Home() {
  const router = useRouter();
  const handleCreateRoom = async () => {
    const { data, error } = await supabase.rpc('create_room').single<Room>()
    if (error) {
      alert(error.message)
      return
    }
    if (data) {
      router.push(`rooms/${data.id}`)
    }
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center py-2'>
      <Head />
      <main className="flex w-full h-full flex-1 flex-col items-center px-20">
        <h1 className='text-4xl px-4 py-2'>Chat App <button onClick={handleCreateRoom} className='text-xs ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded'>New Room</button></h1>
        <h1 className='text-xs ml-4 bg-gray-500 hover:bg-gray-900 text-white font-bold p-2 rounded-bl-lg rounded-tr-lg'><Link href='/rooms/e7a8dec4-8654-40e8-bf53-3d523b641705'>Join the classic room!</Link></h1>
      </main>
    </div>
  )
}
