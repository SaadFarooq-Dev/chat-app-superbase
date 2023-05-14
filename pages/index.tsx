/* eslint-disable react-hooks/exhaustive-deps */
import Loader from '@/components/loader'
import MessageForm from '@/components/messageForm'
import Messages from '@/components/messages'
import NavBar from '@/components/navBar'
import supabase from '@/utils/supabase'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type Room = {
  id: string,
  name: string | null,
  created_at: string,
}

type sessionProps = {
  session: object | null
}


export default function Slack({ session }: sessionProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room>()
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  const getRooms = async () => {
    const { data, error } = await supabase.from('rooms').select('*').order('created_at', { ascending: false })
    if (data) {
      setRooms(data as Room[])
      setActiveRoom(data[0] as Room)
      setLoading(false)
    }
  }

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { roomName } = Object.fromEntries(new FormData(e.currentTarget));
    const { data, error } = await supabase.rpc('create_room', { name: roomName }).single<Room>()
    if (error) {
      alert(error.message)
      return
    }
    if (data) {
      setActiveRoom(data)
      rooms.unshift(data)
    }
  }

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
    getRooms()
  }, []);


  if (loading) {
    return <Loader loading={loading} />
  }

  return (
    <>
      <div className="container mx-auto shadow-lg rounded-lg">
        <NavBar roomId={activeRoom ? activeRoom.id : ''} handleCreateRoom={handleCreateRoom} />
        <div className="flex flex-row justify-between bg-white" style={{ minHeight: '90vh', maxHeight: '90vh' }}>
          <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
            <div className="border-b-2 py-4 px-2">
              <input
                type="text"
                placeholder="search chatting"
                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            {
              rooms.filter(val => val.name ? val.name.includes(filter) : false).map(room => (
                <div key={room.id} className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 ${room.id === activeRoom?.id ? 'border-l-4 border-blue-400 ' : ''} `}>
                  <div className="w-1/4">
                    <Image
                      width={20} height={20}
                      src={`https://picsum.photos/200/300?${room.id}`}
                      className="object-cover h-12 w-12 rounded-full"
                      alt="Group Image"
                    />
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold"><button onClick={() => setActiveRoom(room)} > {room.name ?? "Untitled"}</button></div>
                    <span className="text-gray-500">Message here!</span>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="w-full px-5 flex flex-col justify-between">
            <div className="flex flex-col mt-5 overflow-y-auto">
              <Messages roomId={activeRoom ? activeRoom.id : ''} />
            </div>
            <div className="py-5">
              <MessageForm roomId={activeRoom ? activeRoom.id : ''} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
