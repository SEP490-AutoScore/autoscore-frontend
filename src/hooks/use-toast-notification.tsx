import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useCallback } from "react";

export function useToastNotification() {
  const { toast } = useToast();

  return useCallback(
    ({
      title = "Uh oh! Something went wrong.",
      description = "There was a problem with your request.",
      actionText,
      variant = "default",
    
    }: {
      title?: string;
      description: string;
      actionText?: string;
      variant?: "default" | "destructive";
   
    }) => {
      toast({
        title,
        description,
        action: actionText ? (
          <ToastAction altText="Perform an action">{actionText}</ToastAction>
        ) : undefined,
        variant,
      
      });
    },
    [toast]
  );
}