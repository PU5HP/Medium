import { Link } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { Input } from "./input";
import { Button } from "./button";
import { ChangeEvent, useState } from "react";
import { SignupInput } from "@pu5hp/medium-common";

export function SignupCard({ type }: { type: "signup" | "signin" }) {
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: ""
  });

  return (
    <>
      <div className="dark bg-[#1d6f42] h-screen flex justify-center flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="dark:text-white text-5xl font-bold">
            Join Medium
          </div>
          <p className="dark:text-white text-lg ps">
            Already have an account?{" "}
            <Link to={"/signin"} className="pl-2 underline">
              Log in
            </Link>
          </p>

          <div className="flex flex-col gap-4 mt-8 w-full text-inherit">
            <LabelledInput 
              label="Name"
              placeholder=""
              onChange={(e) => {
                setPostInputs({
                  ...postInputs,
                  name: e.target.value
                });
              }}
            />

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



