"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogContext = React.createContext({
  open: false,
  onOpenChange: () => {},
});

export const DialogTrigger = React.forwardRef(
  ({ asChild = false, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(DialogContext);

    const Comp = asChild ? React.Fragment : "button";

    return (
      <Comp
        ref={ref}
        {...props}
        onClick={(e) => {
          props.onClick?.(e);
          onOpenChange(true);
        }}
      >
        {children}
      </Comp>
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

export const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/40"
          onClick={() => onOpenChange(false)}
        />

        {/* Panel */}
        <div
          ref={ref}
          className={cn(
            "relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

export const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;

export { Dialog };
