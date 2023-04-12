// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from '@/utils/supabase'
import type { NextApiRequest, NextApiResponse } from 'next'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sendata = async () =>{
    const {data,error} = await supabase.from('messages_anon').insert({ content: "This is a message", username: (Math.random().toString(36).substring(2,7))}).select('*')
    if(data){
      return data
    }
    return error
  }
  sendata().then((data)=> { res.status(200).json({ name: 'John DoeHello',data: data})}).catch((error)=>{ res.status(200).json({ name: 'John DoeHello',data: error})})

}
