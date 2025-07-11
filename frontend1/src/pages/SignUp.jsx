

function signUp() {
  const [userData , setUserData] = useState({name : "" , email : "" , password : "" }) ; 

  async function handleResister(e){
        alert("we are here in handleRegister") ;
        e.preventDefault() ;

    try{
        const data = await fetch("http://localhost:3000/Api/v1/signup" ,{
              method : "POST" ,
              body : JSON.stringify(userData) ,
              headers : {
                "Content-Type" : "application/json"
              }

        });
        const res = await data.json() ;
      

    }catch(err){
      console.log(err) ;
    }

  }
  return (
    <div className="w-[20%] flex flex-col items-center gap-10 ">
       <h1 className="text-3xl ">Sign Up </h1>
       <form className="w-[100%] flex flex-col items-center gap-10" 
             onSubmit={handleResister}
       > 

            <input type="text" className=" w-full h-8 p-2 text-white bg-gray-500 rounded-md" placeholder="enter your name"
                   onChange={(e)=>{
                    setUserData(prev => ({...prev , name : e.target.value }))
                   }}
            />
            <input type="email" className=" w-full h-8 p-2 text-white bg-gray-500 rounded-md" placeholder="enter your email"
                    onChange={(e)=>{
                    setUserData(prev => ({...prev , email : e.target.value }))
                   }}
            />
            <input type="password" className=" w-full h-8 p-2 text-white bg-gray-500 rounded-md" placeholder="enter your password"
                    onChange={(e)=>{
                    setUserData(prev => ({...prev , password : e.target.value }))
                   }}
            />
            <button className="w-[100px] h-[50px] text-white  p-2 rounded-md text-xl bg-green-500 "> resister </button>
       
       </form>
      
      
      
    </div>
  )
}

export default signUp

