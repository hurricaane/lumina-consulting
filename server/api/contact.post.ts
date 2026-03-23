import { render } from "@vue-email/render";
import { Resend } from "resend";

import ContactEmail from "../../emails/ContactEmail.vue";
import env from "../../shared/lib/env";

export default defineEventHandler(async (event) => {
  const { nom, email, message } = await readBody(event);

  // Validation
  if (!nom?.trim() || !message?.trim()) {
    throw createError({ statusCode: 422, message: "Champs requis manquants." });
  }
  if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 422, message: "Adresse email invalide." });
  }

  // Render email template
  const html = await render(ContactEmail, { nom, email, message });

  // Send via Resend
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Lumina Consulting <contact@luminaconsulting.fr>",
    to: ["contact@luminaconsulting.fr"],
    replyTo: email,
    subject: `Nouveau message — ${nom}`,
    html,
  });

  if (error) {
    throw createError({ statusCode: 500, message: "Erreur lors de l'envoi." });
  }

  return { success: true };
});
