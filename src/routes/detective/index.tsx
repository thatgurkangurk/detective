import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { PasswordInput } from "./components/password-input";
import { SendMessageForm } from "./components/send-message-form";
import { StatusChanger } from "./components/status-changer";

function App() {
  const queryClient = useRef(new QueryClient());

  return (
    <QueryClientProvider client={queryClient.current}>
      <main className="min-h-screen bg-zinc-950 p-6">
        <PasswordInput />
        <br />
        <SendMessageForm />
        <br />
        <StatusChanger />
      </main>
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
