import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition"
      {...props}
    >
      {children}
    </button>
  );
}