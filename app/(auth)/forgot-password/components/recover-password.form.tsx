"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendResetEmail } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import useRouter from "next/router";

const RecoverPasswordForm = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const router = useRouter;

  //**********Form************/

  const formSchema = z.object({
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, { message: "Email is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  //*******Sign in *******/

  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    setisLoading(true);

    try {
      await sendResetEmail(user.email);
      toast.success("Email sent successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className='md:border border-solid border-x-gray-300 rounded-xl pd-10'>
      <div className='text-center'>
        <h3 className='text-2xl font-semibold'>Recover Password</h3>

        <p className='text-sm text-muted-foreground'>
          Enter your email and we will send you a link to reset your password
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

          {/* Submit */}

          <div className='mt-8'>
            <Button
              type='submit'
              className='w-full bg-primary text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary-light'
            >
              {isLoading && (
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
              )}
              Recover
            </Button>
          </div>
        </div>
      </form>

      {/* Sign Up */}
      <p className='text-sm text-muted-foreground'>
        <Link
          href='/'
          className='underline text-muted-foreground underline-offset-4 hover:text-primary'
        >
          Go Back
        </Link>
      </p>
    </div>
  );
};

export default RecoverPasswordForm;
