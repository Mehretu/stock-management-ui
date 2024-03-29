import toast from "react-hot-toast"


export async function makePostRequest(
  setLoading,
  endpoint,
  data,
  resourceName,
  reset = () => {}
  ){
    try {
        setLoading(true)
        const baseUrl="http://localhost:3000"
        const response =await fetch(`${baseUrl}/${endpoint}`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(data)
        })
        if(response.ok){
          setLoading(false)
          toast.success(`New ${resourceName} Created Successfully!`)
          reset()
        }else{
          setLoading(false)
          if(response.status === 409){
            toast.error("The Giving Warehouse Stock is NOT enough!")
          }else{
            toast.error("Something went wrong")
          }
        }
        
        
      } catch (error) {
        setLoading(false)
        toast.success("New Warehouse Created Successfully!")
        console.log(error)
        
      }
}

export async function makePutRequest(
  setLoading,
  endpoint,
  data,
  resourceName,
  redirect = () => {},
  reload = () => {},
  
  ){
  try {
      setLoading(true)
      const baseUrl="http://localhost:3000"
      const response =await fetch(`${baseUrl}/${endpoint}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
      })
      if(response.ok){
        console.log(response)
        setLoading(false)
        toast.success(`${resourceName} Updated Successfully!`)
        redirect();
        reload();
      }else{
          setLoading(false)
          toast.error("Something went wrong")
      }
      
      
    } catch (error) {
      setLoading(false)
      toast.success("New Warehouse Update Successfully!")
      console.log(error)
      
    }
}

export async function makeDeleteRequest(setDeleting, endpoint, resourceName) {
  try {
      setDeleting(true);
      const baseUrl="http://localhost:3000"

      const response = await fetch(`${baseUrl}/${endpoint}`, {
          method: "DELETE"
      });

      if (response.ok) {
          setDeleting(false)
          
        
      } else {
          throw new Error(`Failed to delete ${resourceName}`);
      }
  } catch (error) {
      console.error("Error deleting selected items:", error);
      toast.error(`An error occurred while deleting ${resourceName}`);
  } finally {
      setDeleting(false);
  }
}
