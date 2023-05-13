import Groups from '@/components/groups'
import NavBar from '@/components/navBar'
import supabase from '@/utils/supabase'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type Room = {
  id: string,
  name: string | null,
  created_at: string,
}

export default function Home() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { roomName } = Object.fromEntries(new FormData(e.currentTarget));
    const { data, error } = await supabase.rpc('create_room',{ name: roomName }).single<Room>()
    if (error) {
      alert(error.message)
      return
    }
    if (data) {
      router.push(`rooms/${data.id}`)
    }

  }
  const getRooms = async () =>{
    const {data,error} = await supabase.from('rooms').select('*').order('created_at',{ascending: false})
    if(data){
      setRooms(data as Room[])
    }
  }
  useEffect(() => {
    getRooms()
  }, []);

  useEffect(() => {
    console.log(rooms);

  }, [rooms]);

  return (
    <div>
      <NavBar />
      <Groups handleCreateRoom={handleCreateRoom} rooms={rooms}/>
    </div>
    // <div className='flex h-screen flex-col items-center justify-center py-2'>
    //   <Head />
    //   <main className="flex w-full h-full flex-1 flex-col items-center px-20">
    //     <div className='flex justify-between w-full h-10'>
    //       <h1 className='sm:text-sm md:text-xl lg:text-3xl'>Chat App</h1>
    //       <form onSubmit={handleCreateRoom} className='flex '>
    //       <input type="text" name='roomName' id='roomName' className="max-w-lg max-h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
    //       <button type='submit' className='text-xs ml-3 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded'>New Room</button>
    //       </form>
    //       <button className='px-3 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none' type="button" onClick={() => supabase.auth.signOut()}> Logout </button>
    //     </div>
    //     {/* <h1 className='text-xs ml-4 bg-gray-500 hover:bg-gray-900 text-white font-bold p-2 rounded-bl-lg rounded-tr-lg'><Link href='/rooms/e7a8dec4-8654-40e8-bf53-3d523b641705'>Join the classic room!</Link></h1> */}
    //       <div className='flex-1'>
    //         {
    //           rooms.map( room =>(
    //             <div key={room.id}>
    //             <h1 className='mt-4 text-xs ml-4 bg-gray-500 hover:bg-gray-900 text-white font-bold p-2 rounded-bl-lg rounded-tr-lg'><Link href={`/rooms/${room.id}`}> Join the {room.name ?? "Untitled"} room!</Link></h1>
    //             </div>
    //           ))
    //         }
    //       </div>
    //   </main>
    // </div>
  )
}
