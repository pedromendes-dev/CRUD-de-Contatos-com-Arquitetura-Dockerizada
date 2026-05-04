import React from "react";
import { type LogoInternaProps } from "../../utils/types/ContatoLogoTypes";

export function LogoInterna({ size = 50, showText = true, className = "" }: LogoInternaProps) {
  return (
    <div
      className={`inline-flex flex-col items-start pt-4 px-4 pb-4 rounded-[10px] bg-[#101828] ${className}`}
    >
      <div className="flex gap-3 items-center shrink-0 w-full" style={{ height: size }}>
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
            style={{ color: "#ffffff" }}
          >
            <circle cx="50" cy="50" r="46.5" stroke="currentColor" strokeWidth="3" fill="none" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            <circle cx="30" cy="30" r="6" fill="currentColor" />
            <circle cx="70" cy="30" r="6" fill="currentColor" />
            <circle cx="30" cy="70" r="6" fill="currentColor" />
            <circle cx="70" cy="70" r="6" fill="currentColor" />
            <line
              x1="50"
              y1="50"
              x2="30"
              y2="30"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <line
              x1="50"
              y1="50"
              x2="70"
              y2="30"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <line
              x1="50"
              y1="50"
              x2="30"
              y2="70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <line
              x1="50"
              y1="50"
              x2="70"
              y2="70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <line
              x1="30"
              y1="30"
              x2="70"
              y2="30"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
            <line
              x1="30"
              y1="70"
              x2="70"
              y2="70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
            <rect x="20" y="47" width="12" height="2" fill="currentColor" opacity="0.5" rx="1" />
            <rect x="68" y="47" width="12" height="2" fill="currentColor" opacity="0.5" rx="1" />
            <rect x="47" y="20" width="2" height="12" fill="currentColor" opacity="0.5" rx="1" />
            <rect x="47" y="68" width="2" height="12" fill="currentColor" opacity="0.5" rx="1" />
          </svg>
        </div>

        {showText && (
          <div className="flex flex-col justify-center gap-0.5">
            <p className="m-0 font-bold leading-[28px] text-[18px] text-white whitespace-nowrap">
              SmartReg
            </p>
            <p className="m-0 font-normal leading-[16px] text-[12px] text-[#6a7282] whitespace-nowrap">
              Sistema Inteligente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
