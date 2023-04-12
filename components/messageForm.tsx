import supabase from "@/utils/supabase";

type MessageFormProps = {
  roomId: string
}

export default function MessageForm({roomId}: MessageFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { message } = Object.fromEntries(new FormData(e.currentTarget));
    if (typeof message === 'string' && message.trim().length !== 0) {
      e.currentTarget.reset()
      const { data, error } = await supabase.from('messages').insert({ content: message, room_id: roomId}).select('*')
      if (error){
        console.error(error.message)
      }
      // const { data, error } = await supabase.from('messages').insert({ content: message}).select('*')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Write Message</label>
        <input type="text" id="message" name='message' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your message" required />
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
    </form>
  )
}
