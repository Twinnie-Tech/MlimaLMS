"use client"

import { useState, useTransition } from "react"
import { Loader2, Smartphone } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MpesaDialog({
  plan,
  amount,
  label = "Pay with M-Pesa",
  variant = "default",
}: {
  plan: string
  amount: string
  label?: string
  variant?: "default" | "outline"
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      toast.success("Check your phone and enter your M-Pesa PIN to complete payment")
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant={variant}
            className={variant === "default" ? "w-full bg-green-600 text-white hover:bg-green-700" : "w-full"}
          />
        }
      >
        <Smartphone />
        {label}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Pay with M-Pesa</DialogTitle>
            <DialogDescription>
              {plan} · {amount}. We will send an M-Pesa prompt to your phone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="mpesa-phone">M-Pesa phone number</Label>
            <Input id="mpesa-phone" name="phone" type="tel" placeholder="07XX XXX XXX" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending} className="w-full bg-green-600 text-white hover:bg-green-700">
              {pending && <Loader2 className="animate-spin" />}
              {pending ? "Sending prompt..." : `Pay ${amount}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
