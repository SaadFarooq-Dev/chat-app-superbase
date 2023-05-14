import supabase from "@/utils/supabase"
import { useEffect, useState } from "react"


type InviteProps = {
  roomId: string
}

type User = {
  id: string,
  username: string,
}

export default function Invite({ roomId }: InviteProps) {

  const [users, setUsers] = useState<User[]>([])
  const [autoCompleteValue, setAutoCompleteValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<User[]>([]);

  const loaderStyle = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    animation: 'spin 2s linear infinite'
  };

  const handleInvite = async (value: string) => {
    setLoading(true)

    const data = (users.filter(user => user.username === value))[0]
    if (!data) {
      alert("User not found!")
    }
    else {
      const { error } = await supabase.from('room_participants').insert({ profile_id: data.id, room_id: roomId })
      error ? alert(error.message) : alert("User invited")
    }
    setLoading(false)
    return setAutoCompleteValue('')

  }

  const getUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*')
    if (data) {
      setUsers(data as User[])
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const value = event.target.value;
    setAutoCompleteValue(value);

    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      setFilteredSuggestions(users.filter(suggestion => regex.test(suggestion.username)));
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: User) => {
    setAutoCompleteValue(suggestion.username);
    setFilteredSuggestions([]);
    handleInvite(suggestion.username);
  };

  useEffect(() => {
    getUsers()
  }, []);

  return (

    <form onSubmit={(e) => {
      e.preventDefault();
      handleInvite(autoCompleteValue)
    }}>
      <div className="relative inline-block text-left">
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleChange}
          value={autoCompleteValue}
          placeholder="Invite user to this room"
        />
        {loading && <div
          className="absolute right-2 top-1/4 h-5 w-5 animate-spin rounded-full border-2 border-transparent border-r-2 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          style={{ borderTopColor: '#3498db' }}
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span>
        </div>}
        <div className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
          {filteredSuggestions.length > 0 && (
            <ul>
              {filteredSuggestions.map(suggestion => (
                <li className="text-gray-700 block px-4 py-2 text-sm hover:cursor-pointer hover:bg-slate-200" key={suggestion.id} onClick={() => handleSelectSuggestion(suggestion)}>
                  {suggestion.username}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </form>
  )
}
