import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { SendMessageForm } from "./components/send-message-form";

function App() {
  const queryClient = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <SendMessageForm />
    </QueryClientProvider>
  );
}

const rootElem = document.getElementById("root");

if (!rootElem) {
  alert("NO ROOT ELEMENT SOMETHING IS WRONG");
  throw new Error("i'm giving up");
}

const root = createRoot(rootElem);

root.render(<App />);
