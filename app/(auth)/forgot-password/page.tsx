import { Metadata } from "next";

import Logo from "@/components/logo";

import RecoverPasswordForm from "./components/recover-password.form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "We will send you an email to reset your password",
};

const ForgotPassword = () => {
  return (
    <div className='pt-10 lg:p-8 flex items-center md:h-[70vh]'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]'>
        <RecoverPasswordForm />
      </div>
    </div>
  );
};

export default RecoverPasswordForm;
