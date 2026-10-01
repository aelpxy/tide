import { Link, useRouter } from "@tanstack/react-router";
import { Disc3 } from "lucide-react";
import { button } from "../../lib/ui";
import { ErrorLayout } from "./error-layout";

export function NotFoundPage() {
  const router = useRouter();

  return (
    <ErrorLayout
      code="404"
      icon={<Disc3 className="size-7 animate-[spin_4s_linear_infinite]" />}
      title="This page skipped a beat"
      description="We couldn't find what you were looking for. It may have been moved or removed from your server."
    >
      <Link to="/" className={button.primary}>
        Go home
      </Link>
      <button type="button" onClick={() => router.history.back()} className={button.secondary}>
        Go back
      </button>
    </ErrorLayout>
  );
}
