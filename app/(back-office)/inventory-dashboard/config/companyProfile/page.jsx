"use client"
import { getData } from '@/lib/getData';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import NewCompany from '../../sales/company/new/page';

export default function Update() {
    const {data:session,status}=useSession()
    const user = session.user

    console.log("User",user)
    
    // const [users,setUsers] = useState([])
    const [company,setCompany] = useState([])
    useEffect(() => {

        async function fetchData() {
          try{
            if(session && session.user){
                    const userId = session.user.id;
                    const userData = await getData(`user/${userId}`);
                    console.log("User Data",userData)
                    if (userData && userData.companyId) {
                      const companyId = userData.companyId;
                      const companyData = await getData(`companies/${companyId}`);
                      setCompany(companyData);
                  }
                
                  
            }
            
          }catch(error){
            console.error("Error Fetching Data",error)
          }
        }
        fetchData();
    }, [session]);
     

  console.log("Company", company);

   
    
  return (
    <div>
             <NewCompany initialData={company} isUpdate={true} />
    </div>
  )
}
