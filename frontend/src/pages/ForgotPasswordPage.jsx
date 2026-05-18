import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { MailIcon, LoaderIcon, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: forgotPasswordMutation, isPending } = useMutation({
    mutationFn: async (emailAddress) => {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email: emailAddress,
      });
      return response.data;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Password reset email sent!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    forgotPasswordMutation(email);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-md shadow-xl">
        <div className="card-body">
          <button
            onClick={() => navigate("/login")}
            className="btn btn-ghost btn-sm self-start mb-4"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Login
          </button>

          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Forgot Password?</h1>
              <p className="text-base-content opacity-70 text-center mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <div className="relative">
                    <MailIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input input-bordered w-full pl-10"
                      placeholder="you@example.com"
                      disabled={isPending}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <LoaderIcon className="animate-spin size-5" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <MailIcon className="size-12 text-primary mx-auto" />
                <h2 className="text-2xl font-bold">Check Your Email</h2>
                <p className="text-base-content opacity-70">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-base-content opacity-60">
                  The link will expire in 1 hour.
                </p>
              </div>

              <div className="space-y-2 mt-6">
                <p className="text-sm text-center text-base-content opacity-70">
                  Didn't receive an email?
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  className="btn btn-outline w-full"
                >
                  Try Another Email
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-ghost w-full"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
