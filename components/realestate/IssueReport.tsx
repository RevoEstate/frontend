"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";

export function IssueReport() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Please enter your issue description");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/companies/sendissue`,
        { message },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      toast.success("Issue Reported", {
        description: "Thank you for your feedback. We'll look into this shortly.",
      });
      setIsSubmitted(true);
      setMessage("");
    } catch (error) {
      let errorMessage = "Failed to submit issue";
  
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset form when closing dialog
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage("");
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-sky-600 hover:text-sky-700 cursor-pointer">
          Report Issue
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report System Issue</DialogTitle>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <h3 className="text-green-800 font-medium">Thank You!</h3>
              <p className="text-green-700 text-sm mt-1">
                Your issue has been reported successfully. Our team will review it shortly.
              </p>
            </div>
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button 
                  onClick={handleClose}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issue-message" className="text-sm font-medium">
                Describe the issue you're experiencing
              </Label>
              <Textarea
                id="issue-message"
                placeholder="Example: My properties are not being featured even though I've paid for the feature..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button 
                  type="button"
                  variant="outline" 
                  disabled={isSubmitting}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="cursor-pointer bg-sky-600 hover:bg-sky-600/80"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}