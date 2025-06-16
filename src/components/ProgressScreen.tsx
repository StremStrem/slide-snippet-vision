
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import type { Screen } from "@/pages/Index";

interface ProgressScreenProps {
  onNavigate: (screen: Screen) => void;
}

const steps = [
  { id: 1, label: "Download", description: "Downloading video content" },
  { id: 2, label: "Detect Slides", description: "Analyzing frames for slide transitions" },
  { id: 3, label: "OCR", description: "Extracting text from detected slides" },
  { id: 4, label: "Complete", description: "Finalizing extraction results" }
];

const progressLogs = [
  "Initializing extraction process...",
  "Downloading video: React Masterclass",
  "Video downloaded successfully (2.3 GB)",
  "Analyzing frame transitions...",
  "Detected 47 unique slides",
  "Starting OCR processing...",
  "OCR completed for slide 12/47",
  "OCR completed for slide 24/47",
  "OCR completed for slide 36/47",
  "OCR completed for slide 47/47",
  "Generating timestamps...",
  "Processing complete!"
];

export const ProgressScreen = ({ onNavigate }: ProgressScreenProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogs((prev) => {
        if (prev.length < progressLogs.length) {
          return [...prev, progressLogs[prev.length]];
        }
        clearInterval(logInterval);
        return prev;
      });
    }, 800);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    setCurrentStep(Math.min(Math.floor(progress / 25) + 1, 4));
  }, [progress]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onNavigate={onNavigate} currentScreen="extraction" />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => onNavigate('dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            {isComplete && (
              <Button
                onClick={() => onNavigate('results')}
                className="bg-blue-900 hover:bg-orange-500 transition-colors"
              >
                View Results
              </Button>
            )}
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isComplete ? "Extraction Complete!" : "Processing Video..."}
            </h1>
            <p className="text-gray-600">
              {isComplete ? "Your slides are ready for review" : "This may take a few minutes depending on video length"}
            </p>
          </div>

          {/* Progress Steps */}
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep > step.id 
                        ? "bg-green-500 text-white" 
                        : currentStep === step.id 
                        ? "bg-blue-900 text-white" 
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900 mt-2 text-center">
                      {step.label}
                    </div>
                    <div className="text-xs text-gray-500 text-center max-w-20">
                      {step.description}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <Progress value={progress} className="h-2" />
            <div className="text-center mt-2 text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </div>
          </Card>

          {/* Progress Logs */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Log</h3>
            <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
              <div className="space-y-1 font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="text-green-400">
                    <span className="text-gray-500">$</span> {log}
                  </div>
                ))}
                {!isComplete && (
                  <div className="text-green-400 animate-pulse">
                    <span className="text-gray-500">$</span> Processing...
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
