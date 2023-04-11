import Head from '@/components/hello'
import MessageForm from '@/components/messageForm'
import Messages from '@/components/messages'
import Image from 'next/image'


export default function Home() {
  return (
    <div className='flex h-screen flex-col items-center justify-center py-2'>
      <Head/>
    <main className="flex w-full h-full flex-1 flex-col items-center px-20">
        <h1 className='text-4xl animate-pulse px-4 py-2'>Chat App</h1>
      <div className='overflow-y-scroll w-full'>
        <Messages/>
      </div>
      <div className='w-full p-2 my-5'>
      <MessageForm/>
      </div>
    </main>
    </div>
  )
}
