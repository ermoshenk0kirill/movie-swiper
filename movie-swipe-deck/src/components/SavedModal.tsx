import { X } from "lucide-react";
import SavedPanel from "./SavedPanel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-neutral-900 w-full max-w-md rounded-3xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-neutral-700">
          <h2 className="text-xl font-bold">Буду смотреть</h2>
          <button onClick={onClose}>
            <X size={28} className="text-neutral-400 hover:text-white" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <SavedPanel />
        </div>
      </div>
    </div>
  );
}