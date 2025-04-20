import React from "react";

const UploadModal = ({ isOpen, onClose, height, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="relative flex justify-center items-center z-[500]">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>
        <div
          className={`fixed top-[15%] rounded-lg border-2 border-gray-800 p-4 h-[${height}] w-[400px] bg-white z-[500]`}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default UploadModal;
