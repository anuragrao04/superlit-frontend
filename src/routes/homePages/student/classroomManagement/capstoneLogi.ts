interface LogEntry {
  userID: string;
  editorContentBefore: string;
  editorContentAfter: string;
  timestamp: number;
  isPaste: boolean;
  isDeletion: boolean;
  isCompilation: boolean;
  isSubmission: boolean;
}

// In-memory store for logs
const logBuffer: LogEntry[] = [];

export async function logi(
  userID: string,
  editorContentBefore: string,
  editorContentAfter: string,
  timestamp: number,
  isPaste: boolean,
  isDeletion: boolean,
  isCompilation: boolean,
  isSubmission: boolean,
) {
  const newLogEntry: LogEntry = {
    userID,
    editorContentBefore,
    editorContentAfter,
    timestamp,
    isPaste,
    isDeletion,
    isCompilation,
    isSubmission,
  };

  // Push the new entry into our in-memory array
  logBuffer.push(newLogEntry);

  // If log count exceeds 300, force flush
  if (logBuffer.length > 300) {
    forceFlush();
  }
}

export async function forceFlush() {
  console.log("forceFlush called with logs:", logBuffer);

  fetch("/api/capstone-logi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logBuffer),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to send logs");
      }
      console.log("Logs successfully flushed to server");
      // Clear log buffer after successful flush
      logBuffer.length = 0;
    })
    .catch((err) => {
      console.error(err);
    });
}
