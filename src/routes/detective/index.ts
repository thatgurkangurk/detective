import { treaty } from "@elysiajs/eden";
import type { API } from "../../lib/web";

const app = treaty<API>(location.origin);

const form = document.querySelector<HTMLFormElement>(
  'form[name="message-form"]'
);

const passwordInput = document.getElementById(
  "password-input"
) as HTMLInputElement | null;
const messageBox = document.getElementById(
  "message-box"
) as HTMLTextAreaElement | null;
const channelInput = document.getElementById(
  "channel-input"
) as HTMLInputElement | null;
const replyInput = document.getElementById(
  "reply-input"
) as HTMLInputElement | null;
const submitButton = document.getElementById(
  "message-button"
) as HTMLButtonElement | null;

if (
  !form ||
  !passwordInput ||
  !messageBox ||
  !channelInput ||
  !replyInput ||
  !submitButton
) {
  throw new Error("one or more form elements are missing in the DOM");
}

form.addEventListener("submit", async (e) => {
  const label = submitButton.querySelector(".label");
  const loading = submitButton.querySelector(".loading");
  e.preventDefault();

  if (!channelInput.value || !messageBox.value || !passwordInput.value) {
    alert("you need to provide a channel, message and a password");
    return;
  }

  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  label?.classList.add("hidden");
  loading?.classList.remove("hidden");

  try {
    await app.message.post(
      {
        channelId: channelInput.value,
        message: messageBox.value,
        replyToId: replyInput.value,
      },
      {
        headers: {
          Authorization: `Bearer ${passwordInput.value}`,
        },
      }
    );
  } catch (err) {
    console.error(err);
    alert("failed to send message");
  } finally {
    submitButton.setAttribute("aria-busy", "false");
    submitButton.disabled = false;
    loading?.classList.add("hidden");
    label?.classList.remove("hidden");
  }
});
