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
        const responseData = await response.json();
        if(response.ok){
          setLoading(false)
          toast.success(`New ${resourceName} Created Successfully!`)
          reset()
        }else{
          setLoading(false)
          if(response.status === 409){
            toast.error("The Giving Warehouse Stock is NOT enough!")
          }else{
            toast.error(responseData.error || "Something went wrong")
          }
        }
        
        
      } catch (error) {
        setLoading(false)
        // toast.success("New Warehouse Created Successfully!")
        console.error(error)
        toast.error("An error occurred while processing the request");

        
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



export async function makeExportRequest(setLoading, endpoint, data, resourceName) {
  try {
    setLoading(true);
    const baseUrl = "http://localhost:3000";
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Trigger download by parsing the response as a blob
      const blob = await response.blob();
      const fileName = `export-${Date.now()}.xlsx`;
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      setLoading(false);
      toast.success(`${resourceName} Exported Successfully!`);
    } else {
      setLoading(false);
      const responseData = await response.json();
      toast.error(responseData.message || "Something went wrong");
    }
  } catch (error) {
    setLoading(false);
    console.error("Error exporting data:", error);
    toast.error("An error occurred while exporting data");
  }
}




