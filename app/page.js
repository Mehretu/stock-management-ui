import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Login from "./login/page";

export default async function Home() {
  //Getting session Data in Server Side
  const session = await getServerSession(authOptions)
  if(!session){
    return <Login/>
  }
  return<Login/>
}
