import { render } from "@vue-email/render";
import { Resend } from "resend";
import { z } from "zod";

import ReviewEmail from "../../emails/ReviewEmail.vue";
import env from "../../shared/lib/env";

const ReviewSchema = z.object({
  nom: z.string().min(1),
  email: z.email(),
  projet: z.string().optional(),
  note: z.number().int().min(1).max(5),
  temoignage: z.string().min(10),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = ReviewSchema.safeParse(body);
  if (!result.success) {
    throw createError({ statusCode: 400, message: "Données invalides." });
  }

  const { nom, email, projet, note, temoignage } = result.data;

  const html = await render(ReviewEmail, { nom, email, projet, note, temoignage });

  const resend = new Resend(env!.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Lumina Consulting <contact@luminaconsulting.fr>",
    to: ["contact@luminaconsulting.fr"],
    replyTo: email,
    subject: `${"⭐".repeat(note)} Nouvel avis — ${nom} (${note}/5)`,
    html,
  });

  if (error) {
    throw createError({ statusCode: 500, message: "Erreur lors de l'envoi." });
  }

  return { success: true };
});
