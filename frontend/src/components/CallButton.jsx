import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-start p-3 border-b bg-base-100">
      <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white">
        <VideoIcon className="size-5" />
        Start Call
      </button>
    </div>
  );
}

export default CallButton;