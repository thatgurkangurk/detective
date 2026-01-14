import { treaty } from "@elysiajs/eden";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { type FormEvent, useState } from "react";
import type { API } from "../../../lib/web";
import { passwordAtom } from "../context";

const app = treaty<API>(location.origin);

const sendMessageMutationOptions = mutationOptions({
  mutationKey: ["message", "send"],
  mutationFn: (options: {
    data: Parameters<typeof app.message.post>["0"];
    password: string;
  }) =>
    app.message.post(options.data, {
      headers: {
        Authorization: `Bearer ${options.password}`,
      },
    }),
  onError: (error) => {
    alert(error.cause);
  },
});

export function SendMessageForm() {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("");
  const [reply, setReply] = useState("");
  const { mutate, isPending } = useMutation(sendMessageMutationOptions);
  const [password, setPassword] = useAtom(passwordAtom);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    mutate({
      data: {
        channelId: channel,
        message: message,
        replyToId: reply,
      },
      password: password,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
      <div className="w-full">
        <form
          name="message-form"
          onSubmit={handleSubmit}
          className="mx-auto max-w-md space-y-4 rounded-lg bg-zinc-900 p-6 text-zinc-100 shadow-lg shadow-zinc-950/50"
        >
          <fieldset className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="password-input"
                className="font-medium text-sm text-zinc-300"
              >
                Password
              </label>
              <input
                id="password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="message-box"
                className="font-medium text-sm text-zinc-300"
              >
                Message
              </label>
              <textarea
                id="message-box"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="channel-input"
                className="font-medium text-sm text-zinc-300"
              >
                Channel
              </label>
              <input
                id="channel-input"
                type="number"
                required
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="reply-input"
                className="font-medium text-sm text-zinc-300"
              >
                Reply
              </label>
              <input
                id="reply-input"
                type="number"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-lime-500 px-4 py-2 font-medium text-zinc-900 transition hover:bg-lime-400 active:bg-lime-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {!isPending ? (
              <span className="label">send</span>
            ) : (
              <span className="loading">sending...</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
