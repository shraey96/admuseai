"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import ResultScreen from "./result-screen";
import { useState } from "react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  onGenerateAnother: () => void;
}

export default function ResultModal({
  isOpen,
  onClose,
  images,
  onGenerateAnother,
}: ResultModalProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "close" | "generate" | null
  >(null);

  const handleAction = (action: "close" | "generate") => {
    setPendingAction(action);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (pendingAction === "close") {
      onClose();
    } else if (pendingAction === "generate") {
      onGenerateAnother();
      onClose();
    }
    setShowConfirmDialog(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => handleAction("close")}>
        <DialogContent className="max-w-2xl w-full pt-10 items-start md:items-center">
          <ResultScreen
            images={images}
            onGenerateAnother={() => handleAction("generate")}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Your generated images will only be available for the next 24
              hours. Make sure to download them before leaving.
              {pendingAction === "generate" && (
                <p className="mt-2">
                  If you generate new images, you won't be able to access the
                  current ones again.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-[#6366f1] hover:bg-[#5558e6]"
            >
              {pendingAction === "generate" ? "Generate New Images" : "Close"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
