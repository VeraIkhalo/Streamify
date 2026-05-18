import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { CheckCircleIcon, AlertCircleIcon, LoaderIcon } from "lucide-react";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasCalledMutation = useRef(false);

  const token = searchParams.get("token");
  
  // Initialize state based on token availability
  const [verificationStatus, setVerificationStatus] = useState(
    token ? "loading" : "error"
  );

  const { mutate: verifyEmailMutation } = useMutation({
    mutationFn: async (verificationToken) => {
      const response = await axiosInstance.post("/auth/verify-email", {
        token: verificationToken,
      });
      return response.data;
    },
    onSuccess: () => {
      setVerificationStatus("success");
      toast.success("Email verified successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (error) => {
      setVerificationStatus("error");
      toast.error(error.response?.data?.message || "Verification failed");
    },
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    // Only call the mutation once
    if (!hasCalledMutation.current) {
      hasCalledMutation.current = true;
      verifyEmailMutation(token);
    }
  }, [token, verifyEmailMutation]);

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-md shadow-xl">
        <div className="card-body items-center text-center">
          {verificationStatus === "loading" && (
            <>
              <LoaderIcon className="animate-spin size-12 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verifying Email</h2>
              <p className="text-base-content opacity-70">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <CheckCircleIcon className="size-12 text-success mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-success">Email Verified!</h2>
              <p className="text-base-content opacity-70 mb-6">
                Your email has been verified successfully. You'll be redirected shortly.
              </p>
              <button
                onClick={() => navigate("/")}
                className="btn btn-primary"
              >
                Go to Home
              </button>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <AlertCircleIcon className="size-12 text-error mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-error">Verification Failed</h2>
              <p className="text-base-content opacity-70 mb-6">
                The verification link is invalid or has expired. Please request a new one.
              </p>
              <div className="space-y-2 w-full">
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-primary w-full"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => navigate("/resend-verification")}
                  className="btn btn-outline w-full"
                >
                  Resend Verification Email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
