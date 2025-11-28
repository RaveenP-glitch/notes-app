import React, { useEffect } from 'react';
import { LuCheck, LuX, LuCircleAlert, LuInfo } from 'react-icons/lu';

const Toast = ({ isShown, type, data, onClose }) => {
  useEffect(() => {
    if (isShown) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isShown, onClose]);

  if (!isShown) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <LuCheck className="text-green-500" size={20} />;
      case "error":
        return <LuX className="text-red-500" size={20} />;
      case "warning":
        return <LuCircleAlert className="text-yellow-500" size={20} />;
      case "info":
        return <LuInfo className="text-blue-500" size={20} />;
      default:
        return <LuInfo className="text-blue-500" size={20} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      case "warning":
        return "border-yellow-500";
      case "info":
        return "border-blue-500";
      default:
        return "border-blue-500";
    }
  };

  return (
    <div className={`fixed top-18 right-4 z-50 transition-all duration-400 ${isShown ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}`}>
      <div className="flex items-center gap-3 py-2 px-4 bg-white border border-gray-200 rounded-md shadow-lg">
        <div className={`w-7 h-7 flex items-center justify-center border rounded-full ${getBorderColor()}`}>
          {getIcon()}
        </div>
        <p className="text-sm text-slate-700">{data}</p>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <LuX size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;