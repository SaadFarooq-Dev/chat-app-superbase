import supabase from "@/utils/supabase"

type InviteProps = {
  roomId: string
}

export default function Invite({roomId}: InviteProps){

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
    <input type="text" placeholder="Invite user to this room" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onKeyDown={handleInvite} />
  )
}
