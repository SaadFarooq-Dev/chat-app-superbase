import Image from "next/image"
import Link from "next/link"

type Room = {
  id: string,
  name: string | null,
  created_at: string,
}

type GroupsProps = {
  handleCreateRoom: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
  rooms: Room[]
}

export default function Groups({ handleCreateRoom, rooms }: GroupsProps) {
  return (
    <div className="min-h-min flex items-center justify-center">
      <div className="bg-gray-800 flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-extralight text-white/50">Groups</h3>
            <div className="inline-flex items-center space-x-2">
              <li className="font-medium text-sm p-3 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-800 sm:p-0 sm:hover:bg-transparent text-gray-600 hover:text-primary transition-colors">
                <form onSubmit={handleCreateRoom} className='flex align-middle'>
                  <input type="text" name='roomName' id='roomName' className="max-w-lg max-h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  <button type='submit' className='text-xs ml-3 bg-gray-600 hover:bg-gray-900 text-white font-bold p-2 rounded'>New Room</button>
                </form>
              </li>
            </div>
          </div>
          <div className="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {
              rooms.map(room => (
                <div key={room.id} className="relative group bg-gray-900 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
                  <Image width={20} height={20} className="w-20 h-20 object-cover object-center rounded-full" src={`https://picsum.photos/200/300?${room.name}`} alt="cuisine" />
                  <h4 className="text-white text-2xl font-bold capitalize text-center"><Link href={`/rooms/${room.id}`}> {room.name ?? "Untitled"} room!</Link></h4>
                  <p className="text-white/50">55 members</p>
                  <p className="absolute top-2 text-white/20 inline-flex items-center text-xs"> Active <span className="ml-2 w-2 h-2 block bg-green-500 rounded-full group-hover:animate-pulse"></span></p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
