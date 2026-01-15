import { useAtom } from "jotai";
import { useId } from "react";
import { passwordAtom } from "../context";

export function PasswordInput() {
  const id = useId();
  const [password, setPassword] = useAtom(passwordAtom);

  return (
    <div className="w-fit space-y-1">
      <label htmlFor={id} className="font-medium text-sm text-zinc-300">
        password
      </label>

      <input
        id={id}
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
      />
    </div>
  );
}
