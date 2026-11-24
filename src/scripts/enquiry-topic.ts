import { enquiryFields, enquiryTopics } from '~/lib/enquiry';

/**
 * Links such as "Talk to us" open the form with a topic chosen (`/contact?topic=enquiry`). Without
 * JavaScript the form simply opens on its default topic.
 */
export function preselectTopic(form: Element | null, search: string): void {
  if (!(form instanceof HTMLFormElement)) return;
  const topic = new URLSearchParams(search).get('topic');
  if (!enquiryTopics.some((t) => t.value === topic)) return;
  const radio = form.querySelector<HTMLInputElement>(
    `input[name="${enquiryFields.topic}"][value="${topic}"]`,
  );
  if (radio) radio.checked = true;
}
