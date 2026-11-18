import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
export default function Loading({ message = "Please Wait ..." }) {
  return (
    <div style={styles.overlay}>
      <div className="flex items-center gap-4">
        <Spinner />
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(158,158,158,0.85)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    transform: "translate(-50%,-50%)",
    width: "100%",
    height: "100vh",
  },
  message: {
    color: "#555",
    fontSize: "14px",
    margin: 0,
  },
};

const styleSheet = document.createElement("style");

document.head.appendChild(styleSheet);

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-6 animate-spin", className)}
      {...props}
    />
  );
}
