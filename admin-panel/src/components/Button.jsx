import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// Modern edit icon button without text
export const EditIconButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
                p-2 
                text-gray-600 
                hover:text-blue-500 
                hover:bg-red-50 
                rounded-full 
                transition-all 
                duration-200 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-300
                transform-gpu       /* GPU acceleration */
                hover:scale-[1.05]  /* 5% subtle zoom */
                hover:-translate-y-px /* 1px lift */
                active:translate-y-0  /* Reset on click */
            "
      aria-label="Edit item"
    >
      <FaEdit className="text-lg" />
    </button>
  );
};

// Modern delete icon button without text
export const DeleteIconButton = ({ onClick }) => {
  return (
    //   <button
    //     onClick={onClick}
    //     className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
    //     aria-label="Delete item"
    //   >
    //     <FaTrash className="text-lg" />
    //   </button>

    <button
      onClick={onClick}
      className="
                p-2 
                text-gray-600 
                hover:text-red-500 
                hover:bg-red-50 
                rounded-full 
                transition-all 
                duration-200 
                focus:outline-none 
                focus:ring-2 
                focus:ring-red-300
                transform-gpu       /* GPU acceleration */
                hover:scale-[1.05]  /* 5% subtle zoom */
                hover:-translate-y-px /* 1px lift */
                active:translate-y-0  /* Reset on click */
            "
      aria-label="Delete item"
    >
      <FaTrash className="text-lg" />
    </button>
  );
};
