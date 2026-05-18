import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Eye, EyeOff, LoaderIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [resetStatus, setResetStatus] = useState("form"); // form, success, error

  const token = searchParams.get("token");

  const { mutate: resetPasswordMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/reset-password", {
        token,
        ...data,
      });
      return response.data;
    },
    onSuccess: () => {
      setResetStatus("success");
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error) => {
      setResetStatus("error");
      toast.error(error.response?.data?.message || "Password reset failed");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      setResetStatus("error");
      toast.error("Invalid or missing reset token");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPasswordMutation(formData);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-md shadow-xl">
        <div className="card-body">
          {resetStatus === "form" && (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
              <p className="text-base-content opacity-70 text-center mb-6">
                Enter your new password below.
              </p>

              {!token && (
                <div className="alert alert-error mb-4">
                  <AlertCircleIcon className="size-6" />
                  <span>Invalid reset link. Please request a new one.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="input input-bordered w-full pr-10"
                      placeholder="••••••••"
                      disabled={isPending || !token}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70"
                      disabled={!token}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input input-bordered w-full pr-10"
                      placeholder="••••••••"
                      disabled={isPending || !token}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70"
                      disabled={!token}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isPending || !token}
                >
                  {isPending ? (
                    <>
                      <LoaderIcon className="animate-spin size-5" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          )}

          {resetStatus === "success" && (
            <div className="text-center space-y-4">
              <CheckCircleIcon className="size-12 text-success mx-auto" />
              <h2 className="text-2xl font-bold text-success">Password Reset!</h2>
              <p className="text-base-content opacity-70">
                Your password has been reset successfully. You'll be redirected to login shortly.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary w-full"
              >
                Go to Login
              </button>
            </div>
          )}

          {resetStatus === "error" && (
            <div className="text-center space-y-4">
              <AlertCircleIcon className="size-12 text-error mx-auto" />
              <h2 className="text-2xl font-bold text-error">Reset Failed</h2>
              <p className="text-base-content opacity-70">
                The reset link is invalid or has expired. Please request a new one.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="btn btn-primary w-full"
                >
                  Request New Link
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-ghost w-full"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
