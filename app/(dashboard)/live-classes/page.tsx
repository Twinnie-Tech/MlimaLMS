import type { Metadata } from "next";
import { Clock, PlayCircle, Video } from "lucide-react";

import { liveClasses, recordings } from "@/lib/dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/dashboard/ui";

export const metadata: Metadata = { title: "Live classes" };

export default function LiveClassesPage() {
  return (
    <>
      <PageTitle
        title="Live classes"
        description="Join live online tuition Monday to Friday, 6:00 PM to 7:00 PM."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>This week&apos;s timetable</CardTitle>
            <CardDescription>Grade 6 · CBC</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {liveClasses.map((item) => (
              <div
                key={item.day}
                className="flex flex-wrap items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40"
              >
                <div className="w-20 text-center">
                  <p className="text-xs text-muted-foreground">{item.day}</p>
                  <p className="font-semibold">{item.date}</p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-lg bg-green-600/10 text-green-600">
                  <Video className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.topic} · {item.teacher}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  {item.time}
                </span>
                {item.live ? (
                  <Button className="bg-red-600 text-white hover:bg-red-700">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-white" />
                    </span>
                    Join now
                  </Button>
                ) : (
                  <Button variant="outline">Remind me</Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recorded classes</CardTitle>
            <CardDescription>Missed a class? Watch it here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recordings.map((item) => (
              <button
                key={item.topic}
                type="button"
                className="group flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/40"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <PlayCircle className="size-5 text-green-600 transition-transform group-hover:scale-110" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.topic}</span>
                  <span className="block text-xs text-muted-foreground">
                    {item.subject} · {item.date}
                  </span>
                </span>
                <Badge variant="secondary">{item.duration}</Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
