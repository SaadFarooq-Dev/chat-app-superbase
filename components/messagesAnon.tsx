import supabase from "@/utils/supabase";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string,
  content: string,
  created_at: string,
  username: string,
}

export default function MessagesAnon() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  const getData = async () => {
    const { data, error } = await supabase.from('messages_anon').select('*')
    if (error) {
      console.error(error.message)
    }
    if (!data) {
      alert('No data')
      return
    }
    setMessages(data as Message[])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { message,username } = Object.fromEntries(new FormData(e.currentTarget));
    if (typeof message === 'string' && typeof username === 'string' && message.trim().length !== 0) {
      e.currentTarget.reset()
      setUser(username)
      const { data, error } = await supabase.from('messages_anon').insert({ content: message, username: username}).select('*')
      if (error){
        console.error(error.message)
      }
    }
  }

  useEffect(() => {
    getData()
  }, []);

  useEffect(() => {
    const subscription = supabase.channel('any').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages_anon' },
    async payload => {
      if(payload){
        setMessages((prevMessages)=> [...prevMessages,payload.new] as Message[])
      }
    }).subscribe()
    return () => {
      supabase.removeChannel(subscription)
    }
  }, []);
  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const insterRandomMessage = async () => {
    const {data,error} = await supabase.from('messages_anon').insert({ content: "This is a message", username: (Math.random().toString(36).substring(2,7))}).select('*')
    console.log(data);
  }

  useEffect(() => {
    insterRandomMessage()
  }, []);

  return (
    <>
    <div className='overflow-y-scroll w-full'>
    <ul className="flex flex-1 flex-col justify-end p-4 space-y-2">
      {messages.map((item) => (
        <li key={item.id} className={item.username === user ? 'self-end bg-orange-100 rounded px-3 py-1': 'bg-slate-200 self-start rounded px-3 py-1'} >
          <span className="block text-xs text-gray-500 font-thin">{item.username}</span>
            <span className="block text-gray-900">{item.content}</span>
        </li>
      ))}
      <span ref={messagesEndRef}/>
    </ul>
  </div>
  <div className="w-full">
  <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Write Message</label>
        <input type="text" id="message" name='message' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={"This is a message"} placeholder="Enter your message" required />
      </div>
      <div className="mb-6">
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
        <input type="text" id="username" name='username' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={Math.random().toString(36).substring(2,7)} placeholder="Enter your username" required />
      </div>
      <button type="submit" id='btn-id' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
    </form>
  </div>
  </>

  )
}
