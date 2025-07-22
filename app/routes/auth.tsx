import { useEffect } from "react";
import { usePuterStore } from "~/lib/Puter"
import { useLocation, useNavigate } from "react-router"

export const meta = ()=>([
{title:'Resumind | auth'},
{title:'description',content:'log into your account'},
]) 
const auth = () => {
    const {isLoading,auth}=usePuterStore();
    const location = useLocation()
    const next = location.search.split('next=')[1];
    const navigate= useNavigate();
    useEffect(()=>{
if(auth.isAuthenticated) navigate(next)
    },[auth.isAuthenticated,next])
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
     
     <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
            <div className="flex flex-col items-center gap-2 text-center ">
                <h1>welcome</h1>
                <h1>log in to continue your account</h1>
            </div>
            <div className="">
                {isLoading?(
                    <button className="auth-button animate-pulse">
                        <p>Signing You In...</p>
                    </button>
                ) : (

                    <>
                    {auth.isAuthenticated?(
                        <button className="auth-button " onClick={auth.signOut}><p>Log Out</p></button>
                    ):(

                        <button className="auth-button " onClick={auth.signIn}><p>Log In</p></button>

                    )}
                    </>
                )}
            </div>
        </section>
     </div>
    </main>
  )
}

export default auth
