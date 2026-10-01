import { Link, useRouter } from "@tanstack/react-router";
import { ChevronDown, WifiOff, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { slide } from "../../lib/motion";
import { button } from "../../lib/ui";
import { ErrorLayout } from "./error-layout";

const isNetworkError = (message: string) => /fetch|network|connect|timed? ?out|refused|dns|unreachable/i.test(message);

export function ErrorPage({ error }: { error: unknown }) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const message = error instanceof Error ? error.message : String(error);
  const offline = isNetworkError(message);

  return (
    <ErrorLayout
      code="500"
      icon={offline ? <WifiOff className="size-7" /> : <Zap className="size-7" />}
      title={offline ? "Can't reach your server" : "Something went off-key"}
      description={
        offline
          ? "Tide couldn't connect to your music server. Check that it's running and that you're online."
          : "An unexpected error happened while loading this page. Trying again usually helps."
      }
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-3">
          <button type="button" onClick={() => void router.invalidate()} className={button.primary}>
            Try again
          </button>
          <Link to="/" className={button.secondary}>
            Go home
          </Link>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="button"
            aria-expanded={showDetails}
            onClick={() => setShowDetails((value) => !value)}
            className="flex items-center gap-1 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
          >
            {showDetails ? "Hide details" : "Show details"}
            <ChevronDown className={`size-3.5 transition-transform duration-150 ${showDetails ? "rotate-180" : ""}`} />
          </button>
          {showDetails && (
            <motion.pre
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={slide}
              className="mt-3 max-w-md overflow-x-auto rounded-lg bg-surface px-4 py-3 text-left font-mono text-xs whitespace-pre-wrap text-neutral-400 ring-1 ring-white/6 select-text"
            >
              {message}
            </motion.pre>
          )}
        </div>
      </div>
    </ErrorLayout>
  );
}
