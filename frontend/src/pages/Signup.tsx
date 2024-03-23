
import {Quote} from "@/components/ui/quote"
import {SignupCard} from "@/components/ui/signupcard"

export function SignupPage (){
  return(
    <>
      <div className="grid grid-cols-2 dark bg-[#1d6f42]">
        <div>
        <SignupCard></SignupCard>
        </div>
        <div className="invisible lg:visible">
        <Quote></Quote>
        </div>
      </div>
    </>
  )
}
  
