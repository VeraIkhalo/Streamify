import { useState, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, UploadIcon, X } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const [isCompressing, setIsCompressing] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  // Compress image using canvas to reduce file size for Stream.io
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      setIsCompressing(true);
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set max dimensions (180x180 for smaller size)
          const maxWidth = 180;
          const maxHeight = 180;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with aggressive compression (0.6 = 60% quality for smaller size)
          let compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

          // Check size (should be < 10KB for safer Stream.io limits)
          let sizeInKB = (compressedBase64.length * 3) / 4 / 1024;

          // If still too large, reduce quality further
          if (sizeInKB > 10) {
            compressedBase64 = canvas.toDataURL("image/jpeg", 0.5);
            sizeInKB = (compressedBase64.length * 3) / 4 / 1024;
          }

          if (sizeInKB > 15) {
            reject(new Error(`Image is still too large (${sizeInKB.toFixed(1)}KB). Please use a smaller or simpler image.`));
          } else {
            resolve(compressedBase64);
            toast.success(`Profile picture uploaded! (${sizeInKB.toFixed(1)}KB)`);
          }
          setIsCompressing(false);
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
          setIsCompressing(false);
        };
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
        setIsCompressing(false);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size before compression (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large. Please use a file smaller than 2MB");
      return;
    }

    try {
      const compressedImage = await compressImage(file);
      setFormState({ ...formState, profilePic: compressedImage });
    } catch (error) {
      toast.error(error.message || "Failed to process image");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFormState({ ...formState, profilePic: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRandomAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      // Use dicebear API instead - more reliable and faster
      const styles = ["avataaars", "pixel-art", "personas", "lorelei"];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      const seed = Math.random().toString(36).substring(7);
      const avatarUrl = `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${seed}`;

      // Test if the URL is accessible with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      try {
        const response = await fetch(avatarUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch avatar");

        setFormState({ ...formState, profilePic: avatarUrl });
        toast.success("Random avatar generated!");
      } catch (fetchError) {
        clearTimeout(timeoutId);
        toast.error("Avatar service is unavailable. Please upload a photo instead.");
        console.error("Avatar fetch error:", fetchError);
      }
    } catch (error) {
      toast.error("Could not generate avatar. Please upload a photo instead.");
      console.error("Avatar generation error:", error);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onboardingMutation(formState);
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="relative">
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                {/* Remove Image Button */}
                {formState.profilePic && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 btn btn-circle btn-sm btn-error"
                    title="Remove image"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isCompressing || isGeneratingAvatar}
              />

              {/* Upload Buttons */}
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary gap-2"
                  disabled={isCompressing || isGeneratingAvatar}
                >
                  {isCompressing ? (
                    <>
                      <LoaderIcon className="animate-spin size-4" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="size-4" />
                      Upload Photo
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-outline gap-2"
                  disabled={isCompressing || isGeneratingAvatar}
                >
                  {isGeneratingAvatar ? (
                    <>
                      <LoaderIcon className="animate-spin size-4" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ShuffleIcon className="size-4" />
                      Or Generate Avatar
                    </>
                  )}
                </button>
              </div>

              {/* Helper Text */}
              <p className="text-xs text-base-content opacity-60 text-center max-w-xs">
                Upload a photo or generate a random avatar. Images are auto-compressed to ~10KB.
              </p>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}

            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;