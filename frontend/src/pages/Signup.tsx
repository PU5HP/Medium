// export function SignupCard (){
//     return(<div>
//         SignupCard
//     </div>)
// }

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SignupCard() {
    return (
      <div className="dark bg-[#1D6F42] flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="dark space-y-8 w-full max-w-xl">
          <div className="dark space-y-2 text-center">
            <h1 className="dark:text-white text-5xl font-bold">Join Medium</h1>
            <p className="dark:text-white text-lg leading-loose">
              Already have an account?{' '}
              <a className="dark:text-white font-medium underline" href="#">
                Log in
              </a>
            </p>
          </div>
          <div className="dark space-y-6">
            <div className="dark space-y-2">
              <Label className="dark:text-white text-lg" htmlFor="name">
                Name
              </Label>
              <Input className="dark:bg-white text-lg" id="name" placeholder="John Doe" required />
            </div>
            <div className="dark space-y-2">
              <Label className="dark:text-white text-lg" htmlFor="email">
                Email
              </Label>
              <Input className="dark:bg-white text-lg" id="email" placeholder="email@example.com" required type="email" />
            </div>
            <div className="dark space-y-2">
              <Label className="dark:text-white text-lg" htmlFor="password">
                Password
              </Label>
              <Input className="dark:bg-white text-lg" id="password" required type="password" />
            </div>
            <Button className="dark:bg-[#1D6F42] dark:text-white w-full text-lg" type="submit">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
