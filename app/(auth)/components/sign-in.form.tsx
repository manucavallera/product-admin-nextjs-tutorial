"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

const SignInform = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);

  //**********Form************/

  const formSchema = z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  //*******Sign in *******/

  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    setisLoading(true);

    try {
      let res = await signIn(user);
      console.log(res);
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <div className='text-center'>
        <h3 className='text-2xl font-semibold'>Sign In</h3>

        <p className='text-sm text-muted-foreground'>
          Enter your email and password to sign in
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid-gap-2'>
          {/* Email */}
          <div className='mb-3'>
            <Label htmlFor='email'>Email</Label>
            <Input
              {...register("email")}
              id='email'
              placeholder='name@example.com'
              type='email'
              autoComplete='email'
            />
            <p className='text-sm text-red-500'>{errors.email?.message}</p>
          </div>
          {/* Password */}
          <div className='mb-3'>
            <Label htmlFor='password'>Password</Label>
            <Input
              {...register("password")}
              id='password'
              placeholder='*******'
              type='password'
            />
            <p className='text-sm text-red-500'>{errors.password?.message}</p>
          </div>

          <Link
            href='/forgot-password'
            className='underline text-muted-foreground underline-offset-4 hover:text-primary mb-6 text-sm text-end'
          >
            Forgot Password?
          </Link>

          {/* Submit */}

          <div className='mt-8'>
            <Button
              type='submit'
              className='w-full bg-primary text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary-light'
            >
              {isLoading && (
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
              )}
              Sign In
            </Button>
          </div>
        </div>
      </form>

      {/* Sign Up */}
      <p className='text-sm text-muted-foreground'>
        {"Don't have an account? "}
        <Link
          href='/sign-up'
          className='underline text-muted-foreground underline-offset-4 hover:text-primary'
        >
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default SignInform;
