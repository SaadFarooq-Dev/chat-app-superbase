import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_URL
const anonKey =  process.env.NEXT_PUBLIC_ANON_KEY

if(!url || !anonKey){
  throw new Error("Type Wrong Error Supabase")
}

const supabase = createClient(
  url,
  anonKey
)

export default supabase
