import { Link, useNavigate} from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { Input } from "./input";
import { Button } from "./button";
import { ChangeEvent, useState } from "react";
import { SignupInput } from "@pu5hp/medium-common";
import axios from "axios";
import {BACKEND_URL} from "../../../config"


export function SignupCard({ type }: { type: "signup" | "signin" }) {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: ""
  });

async function sendRequest(){
  try{
    console.log('in the tryyyyyy')
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,postInputs);
    const jwt = response.data;
    console.log("token is",jwt['jwt'])
    localStorage.setItem("token",'Bearer '+jwt['jwt']);
    navigate("/blog/bulk/posts");
  }
  catch(e){
    //alert the user that the BE request failed 
    alert('Error while signing up')
  }
  
}
  return (
    <>
      <div className="dark bg-[#1d6f42] h-screen flex justify-center flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="dark:text-white text-5xl font-bold hover:dark:text-pink-300">
            Join Medium
          </div>
          <p className="dark:text-white text-lg ps">
            {type ==="signup" ?"Already have an account?":"Don't have an account?"}
            <Link to={type === "signin" ? "/signup" : "/signin"} className="pl-2 underline">
              {type === "signin" ? "Sign up" : "Sign in"}
            </Link>
          </p>

          <div className="flex flex-col gap-4 mt-8 w-full text-inherit">
           {type === "signup" ? <LabelledInput 
              label="Name"
              placeholder=""
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  name: e.target.value
                });
              }} 
            /> : null}

            <LabelledInput
              label="Email"
              placeholder=""
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  email: e.target.value
                });
              }}
            />

            <LabelledInput
              label="Password"
              type={"password"}
              placeholder=""
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  password: e.target.value
                });
              }}
            />
          </div>
          <Button onClick={sendRequest} className="dark:bg-[#1D6F42] dark:text-white w-full text-lg mt-4 hover:dark:text-pink-300" type="submit">
            {type==="signup" ? "Sign up" : "Sign in"}
            </Button>
        </div>
      </div>
      
    </>
  );
}


interface LabelledInputType {
  label: string;
  placeholder:string;
  onChange: (e:ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
  return (
    <div className="w-full">
      <Label className="dark:text-white text-lg">
        {label}
      </Label>
      <Input 
        className="text-l rounded border bg-white border-pink-300 focus:border-pink focus:ring-pink focus:border-2 w-full" // Added focus:border-white, focus:ring-white, and focus:border-4 to customize the focus style of the input box
        onChange={onChange}
        type={type || "text"}
        placeholder={placeholder}
        required
      />
    </div>
  )
}



