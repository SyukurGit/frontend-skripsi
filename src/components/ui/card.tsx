import * as React from "react";
import clsx from "clsx";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border bg-card shadow-[0_10px_28px_rgba(16,24,32,0.045)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("px-5 pt-5 sm:px-6 sm:pt-6", className)} {...props} />;
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}
