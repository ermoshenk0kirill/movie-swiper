import { ArrowLeft } from "lucide-react";
import SavedPanel from "./SavedPanel";

interface Props {
  onBack: () => void;
}

export default function SavedMovies({ onBack }: Props) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-neutral-900 flex flex-col">
      <div className="flex justify-between items-center p-5 border-b border-neutral-700">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft size={28} />
          
        </button>
        <h2 className="text-xl font-bold">Буду смотреть</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 p-5 overflow-y-auto">
        <SavedPanel />
      </div>
    </div>
  );
}