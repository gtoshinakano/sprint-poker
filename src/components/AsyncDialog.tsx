import { ReactNode, useState, useEffect, useMemo } from "react";
import { render } from "react-dom";

let resolve: (resolved: boolean | unknown) => boolean | unknown;

const useConfirm = () => {
  const dialog = useMemo(() => document.createElement("dialog"), []);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.getElementById("modal-root")?.appendChild(dialog);
    if (isOpen) {
      dialog.showModal();
      return () => {
        dialog.close();
        document.getElementById("modal-root")?.removeChild(dialog);
      };
    }
  }, [dialog, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    resolve(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolve(true);
  };

  return {
    confirm: async (content?: ReactNode) => {
      setIsOpen(true);
      render(
        <AsyncDialog
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          isOpen={isOpen}
        >
          {content}
        </AsyncDialog>,
        dialog
      );
      return new Promise((res) => {
        resolve = res;
      });
    },
  };
};

export { useConfirm };

type AsyncDialogProps = {
  handleClose: () => void;
  handleConfirm: () => void;
  isOpen: boolean;
  children?: ReactNode;
};

const AsyncDialog = ({
  handleClose,
  children,
  handleConfirm,
}: AsyncDialogProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full">
      <div>
        {children}
        <button onClick={handleClose}>Cancel</button>
        <button onClick={handleConfirm}>Ok</button>
      </div>
    </div>
  );
};
