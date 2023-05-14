import supabase from "@/utils/supabase";
import { useEffect, useRef, useState } from "react";

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

export default function Messages({roomId}: MessagesProps) {

  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setuserId] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  const getData = async () => {
    const { data, error } = await supabase.from('messages').select('*,profile: profiles(id,username)').match({room_id: roomId}).order('created_at')
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
  }

  const getUser = async ()=>{
    const userId = (await supabase.auth.getUser())?.data?.user?.id
    if(userId){
      setuserId(userId)
    }
  }
  useEffect(() => {
    getUser()
    getData()
  }, []);

  useEffect(() => {
    const subscription = supabase.channel('any').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages',filter: `room_id=eq.${roomId}` },
    async payload => {
      if(payload && profileCache[payload.new.profile_id]){
        setMessages((prevMessages)=> [...prevMessages,{...payload.new, profile: profileCache[payload.new.profile_id]}] as Message[])
      }
      else {
        const {data, error} = await supabase.from('profiles').select('id, username').eq('id',payload.new.profile_id)
        if(error){
          alert(error.message)
          console.error(error.message)
        }
        if(data){
          profileCache[data[0].id] = data[0]
          const newMessage = { ...payload.new, profile: data[0] };
          setMessages((prevMessages)=> [...prevMessages,newMessage] as Message[])
        }
      }
    }).subscribe()
    return () => {
      supabase.removeChannel(subscription)
    }
  }, []);
  useEffect(() => {
    scrollToBottom()
  }, [messages]);


  return (
<ul className="flex flex-1 flex-col justify-end p-4 space-y-2">
      {messages.map((item) => (
        <li key={item.id} className={item.profile_id === userId ? 'self-end bg-orange-100 rounded px-3 py-1': 'bg-slate-200 self-start rounded px-3 py-1'} >
          <span className="block text-xs text-gray-500 font-thin">{item.profile.username}</span>
            <span className="block text-gray-900">{item.content}</span>
        </li>
      ))}
      <span ref={messagesEndRef}/>
    </ul>
  )
}
