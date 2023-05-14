/* eslint-disable react-hooks/exhaustive-deps */
import supabase from "@/utils/supabase";
import { useEffect, useRef, useState } from "react";
import Loader from "./loader";

type Message = {
  id: string,
  content: string,
  profile_id: string,
  created_at: string,
  profile: {
    id: string,
    username: string
  }
}

type MessagesProps = {
  roomId: string
}
let profileCache: any = {}

export default function Messages({ roomId }: MessagesProps) {

  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setuserId] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  const getData = async () => {
    const { data, error } = await supabase.from('messages').select('*,profile: profiles(id,username)').match({ room_id: roomId }).order('created_at')
    if (error) {
      console.error(error.message)
    }
    if (!data) {
      alert('No data')
      return
    }
    data.map(message => message.profile).forEach(profile => {
      profileCache[profile.id] = profile
    })
    setMessages(data as Message[])
    setLoading(false)
  }

  const getUser = async () => {
    const userId = (await supabase.auth.getUser())?.data?.user?.id
    if (userId) {
      setuserId(userId)
    }
  }
  useEffect(() => {
    setLoading(true)
    getUser()
    getData()
  }, [roomId]);

  useEffect(() => {
    const subscription = supabase.channel('any').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
      async payload => {
        if (payload && profileCache[payload.new.profile_id]) {
          setMessages((prevMessages) => [...prevMessages, { ...payload.new, profile: profileCache[payload.new.profile_id] }] as Message[])
        }
        else {
          const { data, error } = await supabase.from('profiles').select('id, username').eq('id', payload.new.profile_id)
          if (error) {
            alert(error.message)
            console.error(error.message)
          }
          if (data) {
            profileCache[data[0].id] = data[0]
            const newMessage = { ...payload.new, profile: data[0] };
            setMessages((prevMessages) => [...prevMessages, newMessage] as Message[])
          }
        }
      }).subscribe()
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  if (loading) {
    return <Loader loading={loading} left={'63%'} />
  }

  return (
    <div className="w-full px-5 flex flex-col justify-between">
      <div className="flex flex-col mt-5">
        {messages.length > 0 ? messages.map((item) => (
          <div key={item.id} className={`${item.profile_id === userId ? 'flex justify-end mb-4' : 'flex justify-start mb-4'} `}>
            <div className={`${item.profile_id === userId ? 'mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white' : 'ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white'}`} >
              <span className="block text-xs text-slate-950 font-medium">{item.profile.username}</span>
              <span className="">{item.content}</span>
            </div>
          </div>
        )) : <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '63%',
            transform: 'translate(-50%, -90%)',
            padding: '10px'
          }}
        >
          <h1 className="font-extrabold text-lg">Be the first to say hello! 👋</h1>

        </div>}
        <span ref={messagesEndRef} />
      </div>
    </div>
  )
}
