"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CheckIcon, CopyIcon, ShareIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function GroupConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const groupId = searchParams.get("id");
  const groupUrl = `${window.location.origin}/groups/${groupId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(groupUrl);
      setCopied(true);
      toast({
        title: "Success!",
        description: "Group URL copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join my FairSplit group",
          text: "Join my expense sharing group on FairSplit",
          url: groupUrl,
        });
        toast({
          title: "Success!",
          description: "Group URL shared successfully",
        });
      } else {
        throw new Error("Web Share API not supported");
      }
    } catch (err) {
      handleCopy();
    }
  };

  const handleContinue = () => {
    router.push(`/groups/${groupId}`);
  };

  if (!groupId) {
    router.push("/groups/new");
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-md mx-auto px-4">
        <Card className="bg-white shadow-lg shadow-primary/5">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Group Created!</CardTitle>
            <CardDescription>
              Share this link with your friends to invite them to your group
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                value={groupUrl}
                readOnly
                className="font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="shrink-0"
              >
                <ShareIcon className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleContinue} className="w-full">
              Continue to Group
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}