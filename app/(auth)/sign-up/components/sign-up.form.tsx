"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, setDocument, updateUser } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@/interfaces/user.interfaces";

const SignUpform = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);

  //**********Form************/

  const formSchema = z.object({
    uid: z.string(),
    name: z.string().min(4, { message: "Name must be at least 4 characters" }),
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
      uid: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  //*******Sign in *******/

  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    console.log(user);

    setisLoading(true);

    try {
      let res = await createUser(user);
      await updateUser({ displayName: user.name });

      user.uid = res.user.uid;
      await createUserInDb(user as User);
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setisLoading(false);
    }
  };

  //**********Create user in Firebase Database************
  const createUserInDb = async (user: User) => {
    const path = "users/" + user.uid;
    setisLoading(true);

    try {
      delete user.password;
      await setDocument(path, user);

      toast(`You're welcome, ${user.name}`, { icon: "👏" });
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <div className='text-center'>
        <h3 className='text-2xl font-semibold'>Create an account</h3>

        <p className='text-sm text-muted-foreground'>
          Enter your details below to create your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid-gap-2'>
          {/* Name */}
          <div className='mb-3'>
            <Label htmlFor='name'>Name</Label>
            <Input
              {...register("name")}
              id='name'
              placeholder='John Doe'
              type='text'
              autoComplete='name'
            />
            <p className='text-sm text-red-500'>{errors.name?.message}</p>
          </div>

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

          {/* Submit */}

          <div className='mt-8'>
            <Button
              type='submit'
              className='w-full bg-primary text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary-light'
            >
              {isLoading && (
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
              )}
              Create
            </Button>
          </div>
        </div>
      </form>

      {/* Sign Up */}
      <p className='text-sm text-muted-foreground'>
        Already have an account?
        <Link
          href='/'
          className='underline text-muted-foreground underline-offset-4 hover:text-primary'
        >
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUpform;
