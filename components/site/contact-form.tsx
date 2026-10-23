"use client"

import { useTransition } from "react"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm({ variant = "support" }: { variant?: "support" | "demo" }) {
  const [pending, startTransition] = useTransition()
  const isDemo = variant === "demo"

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success(
        isDemo
          ? "Demo request received. Our schools team will contact you within 24 hours."
          : "Message sent. Our customer care team will get back to you shortly."
      )
      form.reset()
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Jane Wanjiku" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="07XX XXX XXX" required />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      {isDemo && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="school">School name</Label>
            <Input id="school" name="school" placeholder="Nyeri Primary School" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="learners">Number of learners</Label>
            <Input id="learners" name="learners" type="number" min={1} placeholder="350" />
          </div>
        </div>
      )}
      {!isDemo && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" placeholder="How can we help?" required />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder={isDemo ? "Tell us about your school and what you need." : "Write your message here."}
          required
        />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="bg-green-600 text-white hover:bg-green-700"
      >
        {pending ? <Loader2 className="animate-spin" /> : <Send />}
        {pending ? "Sending..." : isDemo ? "Request a demo" : "Send message"}
      </Button>
    </form>
  )
}
