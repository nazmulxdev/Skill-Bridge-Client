"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Star,
  Send,
  Users,
  Clock,
  Calendar,
  BookOpen,
  User,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Rating } from "./Rating";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { makeSessionReview } from "@/actions/atudent.action";

interface StudentSessionClientProps {
  booking: any;
  student: any;
}

// Helper functions remain the same...
const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getErrorMessage = (error: any): string => {
  if (!error) return "An unknown error occurred";
  if (typeof error === "object" && error !== null) {
    if (error.message) return error.message;
    if (error.error?.message) return error.error.message;
    return "Operation failed. Please try again.";
  }
  if (typeof error === "string") {
    if (error.includes("[object Object]")) {
      return "Operation failed. Please try again.";
    }
    return error;
  }
  return "Something went wrong. Please try again.";
};

const formatTimeElapsed = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function DashboardSessionClient({ booking }: StudentSessionClientProps) {
  const router = useRouter();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      sender: "system",
      message: "Welcome to your session!",
      timestamp: new Date(),
    },
    {
      id: "2",
      sender: "system",
      message: `You're connected with ${booking.tutorProfile?.user?.name}`,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionActive, setSessionActive] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!sessionActive) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionActive]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: "student",
        message: newMessage,
        timestamp: new Date(),
      },
    ]);
    setNewMessage("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "tutor",
          message: "Thanks for your message!",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please rate your session");
      return;
    }
    setSubmittingReview(true);
    const toastId = toast.loading("Submitting review...");
    try {
      const { data, error } = await makeSessionReview({
        bookingId: booking.id,
        rating,
        comment: reviewComment,
      });
      if (error || !data) {
        throw new Error(getErrorMessage(error));
      }
      toast.success("Review submitted successfully!", { id: toastId });
      setSessionEnded(true);
      setTimeout(() => {
        router.push("/dashboard/student/bookings");
      }, 2000);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (sessionEnded) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="mb-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-500/10 mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Session Ended
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Thank you for your session! Redirecting to your bookings...
            </p>
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mx-auto text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-xl border-b border-border/40 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-medium hidden xs:inline">
                Session Active
              </span>
            </div>
            <Separator
              orientation="vertical"
              className="h-4 sm:h-6 hidden xs:block"
            />
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-mono">
                {formatTimeElapsed(timeElapsed)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Badge
              variant="outline"
              className="bg-primary/10 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Users className="h-3 w-3 mr-1 hidden sm:inline" />
              <span className="truncate max-w-[80px] sm:max-w-none">
                {booking.subject?.name}
              </span>
            </Badge>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndSession}
              className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-4"
            >
              <PhoneOff className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">End</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Video Area */}
          <div className="flex-1 p-2 sm:p-4 flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-primary/20 mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
                  </div>
                  <h3 className="text-white text-base sm:text-lg lg:text-xl font-semibold">
                    {booking.tutorProfile?.user?.name}
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm">Tutor</p>
                </div>
              </div>

              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex gap-1 sm:gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 sm:h-10 sm:w-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                >
                  {audioEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 sm:h-10 sm:w-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                >
                  {videoEnabled ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div
              className={cn(
                "absolute overflow-hidden border-2 border-white/20 rounded-lg",
                "bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6",
                "h-16 w-24 sm:h-20 sm:w-32 lg:h-24 lg:w-36 xl:h-28 xl:w-44",
                "bg-gradient-to-br from-gray-800 to-gray-700",
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-white/50" />
              </div>
              <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 flex gap-1">
                {!videoEnabled && (
                  <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                    <VideoOff className="h-2 w-2" />
                  </Badge>
                )}
                {!audioEnabled && (
                  <Badge variant="destructive" className="h-4 px-1 text-[10px]">
                    <MicOff className="h-2 w-2" />
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div
            className={cn(
              "w-full sm:w-80 border-l border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 flex flex-col",
              "absolute right-0 h-full z-20",
              showChat ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowChat(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col",
                    msg.sender === "student" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2",
                      msg.sender === "student"
                        ? "bg-primary text-primary-foreground"
                        : msg.sender === "system"
                          ? "bg-muted text-muted-foreground italic"
                          : "bg-muted",
                    )}
                  >
                    <p className="text-xs sm:text-sm">{msg.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border/40">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[60px] resize-none text-xs sm:text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="h-[60px] w-[60px] shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {!showChat && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 bottom-20 h-12 w-12 rounded-full shadow-lg z-10"
              onClick={() => setShowChat(true)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Session Controls */}
        <footer className="bg-card/80 backdrop-blur-xl border-t border-border/40 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <Button
              size="icon"
              variant="outline"
              className={cn(
                "h-10 w-10 sm:h-12 sm:w-12 rounded-full transition-all",
                !audioEnabled && "bg-destructive/10 border-destructive/30",
              )}
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? (
                <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className={cn(
                "h-10 w-10 sm:h-12 sm:w-12 rounded-full transition-all",
                !videoEnabled && "bg-destructive/10 border-destructive/30",
              )}
              onClick={() => setVideoEnabled(!videoEnabled)}
            >
              {videoEnabled ? (
                <Video className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <VideoOff className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
              onClick={handleEndSession}
            >
              <PhoneOff className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </footer>
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              How was your session?
            </DialogTitle>
            <DialogDescription>
              Please rate your experience with{" "}
              {booking.tutorProfile?.user?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 py-4">
            <div className="bg-muted/30 p-3 sm:p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="truncate">
                  {formatDate(booking.timeSlot?.date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="truncate">
                  {formatTime(booking.timeSlot?.startTime)} -{" "}
                  {formatTime(booking.timeSlot?.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{booking.subject?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                <span>Duration: {formatTimeElapsed(timeElapsed)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Rating</Label>
              <Rating value={rating} onChange={setRating} size="lg" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review-comment" className="text-sm sm:text-base">
                Write a review (Optional)
              </Label>
              <Textarea
                id="review-comment"
                placeholder="Share your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="text-sm"
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                Your review helps other students find the right tutor. Thank you
                for your feedback!
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              size="lg"
              className="w-full gap-2 text-sm sm:text-base"
              onClick={handleSubmitReview}
              disabled={rating === 0 || submittingReview}
            >
              {submittingReview ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Star className="h-4 w-4" />
                  Submit Review & End Session
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
