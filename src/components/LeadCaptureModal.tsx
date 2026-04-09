import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ── Schema ─────────────────────────────────────────── */
const leadSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(255),
  phone: z.string().max(20).optional().or(z.literal("")),
  situation: z.string().optional().or(z.literal("")),
});
type LeadForm = z.infer<typeof leadSchema>;

const SITUATIONS = [
  "Thinking about selling soon",
  "Just curious about my home's value",
  "Exploring refinancing",
  "Researching the neighborhood",
  "Evaluating an investment",
];

/* ── Hook: dwell timer + cooldown ───────────────────── */
export function useLeadModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const cooldownUntil = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const startTimer = useCallback(() => {
    if (submitted) return;
    if (Date.now() < cooldownUntil.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (Date.now() >= cooldownUntil.current && !submitted) {
        setOpen(true);
      }
    }, 8000);
  }, [submitted]);

  const openModal = useCallback(() => {
    if (!submitted) setOpen(true);
  }, [submitted]);

  const closeModal = useCallback(() => {
    setOpen(false);
    cooldownUntil.current = Date.now() + 60_000;
    clearTimeout(timerRef.current);
    // restart timer after cooldown
    setTimeout(() => startTimer(), 60_000);
  }, [startTimer]);

  const markSubmitted = useCallback(() => {
    setSubmitted(true);
    setOpen(false);
    clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, [startTimer]);

  return { open, submitted, openModal, closeModal, markSubmitted };
}

/* ── CTA Card ───────────────────────────────────────── */
export function ExpertReviewCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4 lg:relative lg:sticky lg:top-20">
      <h3 className="text-[22px] font-semibold text-navy leading-tight">
        Want a professional opinion?
      </h3>
      <p className="text-base text-mid leading-relaxed">
        Algorithms miss renovations, lot premiums, and condition. A local agent
        review is free.
      </p>
      <Button
        onClick={onClick}
        className="w-full h-12 rounded-md bg-navy text-sky hover:bg-navy/90 font-semibold text-base transition-all"
      >
        Get Expert Review
      </Button>
      <p className="text-xs text-mid text-center">
        Usually responds within 2 hours
      </p>
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────── */
interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  estimateId?: string;
}

export function LeadCaptureModal({
  open,
  onClose,
  onSubmitted,
  estimateId,
}: LeadCaptureModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { full_name: "", email: "", phone: "", situation: "" },
  });

  const onSubmit = async (values: LeadForm) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const { error } = await supabase.from("vm_leads").insert({
        estimate_id: estimateId || null,
        full_name: values.full_name,
        email: values.email,
        phone: values.phone || null,
        situation: values.situation || null,
        utm_source: params.get("utm_source") || null,
        utm_medium: params.get("utm_medium") || null,
        utm_campaign: params.get("utm_campaign") || null,
      });
      if (error) throw error;
      setSuccess(true);
      onSubmitted();
      toast({ title: "Thank you!", description: "We'll be in touch shortly." });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card rounded-xl shadow-xl w-full max-w-[480px] p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-mid hover:text-navy transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {success ? (
          /* ── Confirmation ────────────────────────── */
          <div className="text-center py-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky/10 mb-4">
              <FileText className="h-6 w-6 text-sky" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Review Requested!</h3>
            <p className="text-sm text-mid">
              A licensed agent will contact you shortly to discuss your property.
            </p>
          </div>
        ) : (
          /* ── Form ────────────────────────────────── */
          <>
            <h2 className="text-[22px] font-semibold text-navy mb-1">
              Request a Professional Review
            </h2>
            <p className="text-sm text-mid mb-6">
              A licensed local agent will contact you to discuss your estimate.
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy">Full Name</label>
                <Input
                  placeholder="Jane Smith"
                  {...form.register("full_name")}
                  className="rounded-md"
                />
                {form.formState.errors.full_name && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="jane@example.com"
                  {...form.register("email")}
                  className="rounded-md"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy">
                  Phone Number{" "}
                  <span className="text-mid font-normal">(optional)</span>
                </label>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  {...form.register("phone")}
                  className="rounded-md"
                />
              </div>

              {/* Situation */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-navy">
                  What describes your situation?
                </label>
                <Controller
                  control={form.control}
                  name="situation"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="rounded-md">
                        <SelectValue placeholder="Select one…" />
                      </SelectTrigger>
                      <SelectContent>
                        {SITUATIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !form.formState.isValid}
                className="w-full h-12 rounded-md bg-navy text-sky hover:bg-navy/90 font-semibold text-base transition-all"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {loading ? "Submitting…" : "Request Review"}
              </Button>

              {/* TCPA */}
              <p className="text-center" style={{ fontSize: "11px", color: "#94a3b8" }}>
                By submitting, you agree to be contacted by a licensed real estate
                professional. Standard message rates may apply.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
