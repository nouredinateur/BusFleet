import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface AlertMessagesProps {
  error: string;
  success: string;
}

export function AlertMessages({ error, success }: AlertMessagesProps) {
  if (!error && !success) return null;

  return (
    <div className="mb-6 space-y-4">
      {error && (
        <Alert className="border-error-200 bg-error-50">
          <AlertCircle className="h-4 w-4 text-error-600" />
          <AlertDescription className="text-error-700 font-forum">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-success-200 bg-success-50">
          <CheckCircle className="h-4 w-4 text-success-600" />
          <AlertDescription className="text-success-700 font-forum">
            {success}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}