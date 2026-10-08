 import chessBg from "../icons/background.png";
import { Crown } from "lucide-react";
 import { Button } from "../component/button";
import { useNavigate } from "react-router-dom";

 export const LandingPage=()=>
 {
  const navi=useNavigate();

 
return (
  <div className="min-h-screen bg-center bg-cover bg-no-repeat flex justify-center items-center " style={{ backgroundImage: `url(${chessBg})` }}>
    <div>
          <div className="flex flex-col items-center">


  <Crown
    size={48}
    strokeWidth={1.8}
    className="mb-3 text-[#F7D878]"
  />

 
  <h1 className="font-serif text-6xl font-bold tracking-[0.08em] text-white md:text-8xl">
    CHESS
  </h1>

  
  <p className="mt-3 text-xs font-medium tracking-[0.45em] text-[#D4AF37] md:text-sm">
    THINK <span className="mx-2">•</span> PLAN <span className="mx-2">•</span> OUTPLAY
  </p>

  
  <div className="mt-7 flex w-full max-w-md items-center justify-center gap-4">

    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/70 to-[#D4AF37]" />

    <div className="h-4 w-4 rotate-45 border-2 border-[#D4AF37] bg-transparent" />

    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/70 to-[#D4AF37]" />

  </div>

</div>
          <div className="flex justify-center mt-3">
             <div >
            <Button variant="primary" size="lg" text="Play online"  onClick={()=>{navi("/game")}}/>
           </div>
          </div>
          </div>
    </div>
)
}