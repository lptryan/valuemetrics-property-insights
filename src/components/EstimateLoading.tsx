import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  { label: "Locating property...", target: 30, duration: 1200 },
  { label: "Analyzing comparable sales...", target: 65, duration: 1200 },
  { label: "Calculating market value...", target: 95, duration: 1200 },
];

interface EstimateLoadingProps {
  address: string;
  onComplete: () => void;
}

const EstimateLoading = ({ address, onComplete }: EstimateLoadingProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (stepIndex < STEPS.length) {
      // Animate progress to target
      const step = STEPS[stepIndex];
      const startProgress = stepIndex === 0 ? 0 : STEPS[stepIndex - 1].target;
      const increment = (step.target - startProgress) / 20;
      let current = startProgress;

      const interval = setInterval(() => {
        current = Math.min(current + increment, step.target);
        setProgress(current);
        if (current >= step.target) clearInterval(interval);
      }, step.duration / 20);

      timeout = setTimeout(() => {
        clearInterval(interval);
        setProgress(step.target);
        if (stepIndex < STEPS.length - 1) {
          setStepIndex((i) => i + 1);
        } else {
          // Final step done — complete after brief pause
          setTimeout(() => {
            setProgress(100);
            setTimeout(onComplete, 300);
          }, 200);
        }
      }, step.duration);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [stepIndex, onComplete]);

  const currentStep = STEPS[Math.min(stepIndex, STEPS.length - 1)];

  return (
    <div className="fixed inset-0 z-50 bg-card flex items-center justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-[480px] px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <MapPin className="h-4 w-4 text-mid" />
          <p className="text-sm text-mid">Estimating value for:</p>
        </div>
        <p className="text-base font-semibold text-navy mb-10">{address}</p>

        <div className="space-y-4">
          <Progress
            value={progress}
            className="h-1 bg-muted"
          />
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 border-2 border-sky border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-mid">{currentStep.label}</p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                i <= stepIndex ? "bg-sky" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EstimateLoading;
