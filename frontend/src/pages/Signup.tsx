
import {Quote} from "@/components/ui/quote"
import {SignupCard} from "@/components/ui/signupcard"

export function SignupPage (){
  return(
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 dark bg-[#1d6f42]">
        <div>
        <SignupCard type="signup"></SignupCard>
        </div>
        <div className="hidden lg:block">
        <Quote></Quote>
        </div>
      </div>
    </>
  )
}
  
