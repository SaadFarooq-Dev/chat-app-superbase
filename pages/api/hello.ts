// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from '@/utils/supabase'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const sendata = async () =>{
    const {data,error} = await supabase.from('messages_anon').insert({ content: "This is a message", username: (Math.random().toString(36).substring(2,7))}).select('*')
  }
  sendata()
  res.status(200).json({ name: 'John DoeHello'})
}
