"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = "md", ...props }, ref) => {
    const [error, setError] = React.useState(false);

    if (src && !error) {
      return (
        <div
          ref={ref}
          className={cn(
            "relative flex shrink-0 overflow-hidden rounded-full",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <img
            src={src}
            alt={name || "Avatar"}
            className="aspect-square h-full w-full object-cover"
            onError={() => setError(true)}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {name ? getInitials(name) : "?"}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
