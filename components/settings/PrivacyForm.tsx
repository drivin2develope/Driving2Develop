"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, Checkbox, Button, Dialog, DialogTrigger, DialogContent, DialogClose, useToast } from "@/components/ui";

export function PrivacyForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [storeTranscripts, setStoreTranscripts] = useState(true);
  const [shareWithManager, setShareWithManager] = useState(true);
  const [open, setOpen] = useState(false);

  async function logoutEverywhere() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Data & privacy" subtitle="Control how your practice data is used. Preferences are stored locally in this build." />
        <div className="space-y-4">
          <Checkbox checked={storeTranscripts} onCheckedChange={(v) => { setStoreTranscripts(!!v); toast({ kind: "success", title: "Preference saved" }); }}
            label="Store my session transcripts" description="Keeps transcripts so you can review them on the report page." />
          <Checkbox checked={shareWithManager} onCheckedChange={(v) => { setShareWithManager(!!v); toast({ kind: "success", title: "Preference saved" }); }}
            label="Share my scores with my manager" description="Lets your manager see your scorecards and assign drills." />
        </div>
      </Card>
      <Card>
        <CardHeader title="Sessions" />
        <Button variant="secondary" onClick={logoutEverywhere}>Log out of this device</Button>
      </Card>
      <Card>
        <CardHeader title="Danger zone" subtitle="Permanent actions." />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button variant="destructive">Delete account</Button></DialogTrigger>
          <DialogContent open={open} title="Delete your account?" description="This is a demo build — no data will actually be deleted, but this is where the confirmation would live.">
            <div className="flex justify-end gap-3 mt-2">
              <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
              <Button variant="destructive" onClick={() => { setOpen(false); toast({ kind: "info", title: "Account deletion is disabled in this demo." }); }}>Yes, delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
