import type { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary"| "logout";
    size: "sm" | "md" | "lg"|"login";
    text: string;
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    onClick?: () => void;
    loading?:boolean;
    type?: "button" | "submit";
}


const variantStyles = {
    primary: "group flex items-center justify-between rounded-xl border border-[#D4AF37]/60 bg-[#D4AF37]/20 text-white backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.20)] transition-all duration-300 hover:bg-[#D4AF37]/35 hover:border-[#F7D878] hover:shadow-[0_0_35px_rgba(212,175,55,0.45)] active:bg-[#AA822C]/40 px-16",
    secondary: "group flex items-center justify-between rounded-xl border border-[#3B82F6]/60 bg-[#3B82F6]/20 text-white backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.20)] transition-all duration-300 hover:bg-[#3B82F6]/35 hover:border-[#60A5FA] hover:shadow-[0_0_35px_rgba(59,130,246,0.45)] active:bg-[#2563EB]/40",
    logout: "bg-red-600 text-white",
};

const sizeStyles = {
    "sm": "py-1 px-2 text-sm rounded-sm",
    "md": "py-1.5 px-3 text-base rounded-md",
    "lg": "py-4 px-6 text-xl rounded-xl",
    "login": "w-[65%] py-1 px-2 text-xl rounded-md bg-indigo-600 text-white"
};

export const Button = (props: ButtonProps) => {
    const isDisabled = Boolean(props.loading);

    return (
        <button
            type={props.type ?? "button"}
            onClick={isDisabled ? undefined : props.onClick}
            disabled={isDisabled}
            aria-busy={isDisabled}
            className={`${variantStyles[props.variant]}  ${sizeStyles[props.size]} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}
            {props.text}
            {props.endIcon}
        </button>
    );
};