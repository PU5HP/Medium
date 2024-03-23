import { SignupCard } from "@/components/ui/signupcard"

export function SigninCard() {
  return (
<>
<div className="grid grid-cols-1  dark bg-[#1d6f42]">
        <div>
        <SignupCard type="signin"></SignupCard>
        </div>
        <div className="hidden lg:block">
        </div>
      </div>
</>
  )
}

