import { site } from "@/config/site";

/** wa.me link that opens a chat with the sales line, the message pre-filled. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
