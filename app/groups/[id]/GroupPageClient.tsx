"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GroupPageClient() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Group ID: {params.id}</p>
            {/* We'll add more group details here in the next step */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}