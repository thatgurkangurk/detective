import { mutationOptions, useMutation } from "@tanstack/react-query";
import { ActivityType } from "discord-api-types/v10";
import { useAtomValue } from "jotai";
import { useId, useMemo, useState } from "react";
import { app } from "../client";
import { passwordAtom } from "../context";

const setStatusMutationOptions = mutationOptions({
  mutationKey: ["client", "status"],
  mutationFn: (options: {
    data: Parameters<typeof app.client.status.post>[0];
    password: string;
  }) =>
    app.client.status.post(options.data, {
      headers: {
        Authorization: `Bearer ${options.password}`,
      },
    }),
  onError: (error) => {
    alert(error.cause ?? "Failed to set status");
  },
});

export function StatusChanger() {
  const id = useId();
  const password = useAtomValue(passwordAtom);
  const { mutate, isPending } = useMutation(setStatusMutationOptions);

  const [activity, setActivity] = useState({
    type: ActivityType.Playing,
    name: "",
  });

  const activityOptions = useMemo(
    () =>
      Object.entries(ActivityType)
        .filter(([k]) => Number.isNaN(Number(k)))
        .map(([key, value]) => ({
          label: key,
          value: value as ActivityType,
        })),
    []
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!activity.name.trim()) return;

    mutate({
      data: activity,
      password,
    });
  }

  return (
    <form onSubmit={submit} className="w-fit space-y-2">
      <label htmlFor={id} className="font-medium text-sm text-zinc-300">
        Bot status
      </label>

      <select
        value={activity.type}
        onChange={(e) =>
          setActivity((a) => ({
            ...a,
            type: Number(e.target.value) as ActivityType,
          }))
        }
        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
      >
        {activityOptions.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <input
        id={id}
        type="text"
        required
        value={activity.name}
        onChange={(e) =>
          setActivity((a) => ({
            ...a,
            name: e.target.value,
          }))
        }
        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
      />

      <button
        type="submit"
        disabled={isPending || !activity.name.trim()}
        className="w-full rounded-md bg-lime-500 px-4 py-2 font-medium text-zinc-900 transition hover:bg-lime-400 active:bg-lime-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "setting..." : "set"}
      </button>
    </form>
  );
}
