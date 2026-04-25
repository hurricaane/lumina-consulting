<script setup lang="ts">
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@vue-email/components";

defineProps<{
  nom: string;
  email: string;
  projet?: string;
  note: number;
  temoignage: string;
}>();

// lumina-deep  oklch(0.18 0.04 240) ≈ #1a1d2e
// lumina-300   oklch(0.84 0.09 230) ≈ #89c8ef
// lumina-50    oklch(0.975 0.015 230) ≈ #f2f7fd
// lumina-100   oklch(0.945 0.035 230) ≈ #e5effa
// muted text   oklch(0.55 0.03 240) ≈ #7a8aaa
</script>

<template>
  <Html lang="fr" dir="ltr">
    <Head />

    <Preview>Nouvel avis {{ note }}/5 de {{ nom }} via luminaconsulting.fr</Preview>

    <Body style="background-color: #f2f7fd; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
      <!-- Top accent bar -->
      <Section style="background-color: #89c8ef; height: 3px; padding: 0; margin: 0;" />

      <!-- Header -->
      <Section style="background-color: #1a1d2e; padding: 28px 48px;">
        <Text style="color: #ffffff; font-family: Georgia, 'Times New Roman', Times, serif; font-size: 13px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase; margin: 0; padding: 0;">
          Lumina Consulting
        </Text>
      </Section>

      <!-- Main card -->
      <Container style="max-width: 560px; margin: 0 auto;">
        <Section style="background-color: #ffffff; padding: 48px 48px 40px 48px;">
          <!-- Eyebrow -->
          <Text style="color: #89c8ef; font-size: 10px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; margin: 0 0 20px 0; padding: 0;">
            Nouvel avis client
          </Text>

          <!-- Reviewer name -->
          <Text style="color: #1a1d2e; font-family: Georgia, 'Times New Roman', Times, serif; font-size: 30px; font-style: italic; font-weight: 400; letter-spacing: -0.02em; line-height: 1.15; margin: 0 0 12px 0; padding: 0;">
            {{ nom }}
          </Text>

          <!-- Stars -->
          <Text style="color: #89c8ef; font-size: 20px; margin: 0 0 36px 0; padding: 0; letter-spacing: 2px;">
            {{ "★".repeat(note) }}{{ "☆".repeat(5 - note) }}
            <span style="color: #7a8aaa; font-size: 13px; letter-spacing: 0; margin-left: 8px;">{{ note }}/5</span>
          </Text>

          <Hr style="border: none; border-top: 1px solid #e5effa; margin: 0 0 32px 0;" />

          <!-- Email row -->
          <Section style="margin: 0 0 20px 0; padding: 0;">
            <Text style="color: #7a8aaa; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 5px 0; padding: 0;">
              Email
            </Text>
            <Link
              :href="`mailto:${email}`"
              style="color: #89c8ef; font-size: 15px; text-decoration: none; line-height: 1.5;"
            >
              {{ email }}
            </Link>
          </Section>

          <!-- Projet row (optional) -->
          <Section v-if="projet" style="margin: 0 0 36px 0; padding: 0;">
            <Text style="color: #7a8aaa; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 5px 0; padding: 0;">
              Projet
            </Text>
            <Text style="color: #1a1d2e; font-size: 15px; line-height: 1.5; margin: 0; padding: 0;">
              {{ projet }}
            </Text>
          </Section>

          <!-- Témoignage block -->
          <Section style="background-color: #f2f7fd; border-left: 3px solid #89c8ef; padding: 22px 24px; margin: 0 0 36px 0;">
            <Text style="color: #7a8aaa; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 14px 0; padding: 0;">
              Témoignage
            </Text>
            <Text style="color: #1a1d2e; font-family: Georgia, 'Times New Roman', Times, serif; font-size: 16px; line-height: 1.8; margin: 0; padding: 0; white-space: pre-wrap;">
              {{ temoignage }}
            </Text>
          </Section>

          <!-- Prismic-ready block -->
          <Section style="background-color: #1a1d2e; padding: 20px 24px; margin: 0;">
            <Text style="color: #89c8ef; font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; margin: 0 0 12px 0; padding: 0;">
              Prêt à copier dans Prismic
            </Text>
            <Text style="color: #ffffff; font-size: 13px; line-height: 1.9; margin: 0; padding: 0; font-family: monospace;">
              Nom : {{ nom }}<br>
              Contexte : {{ projet || "(laisser vide)" }}<br>
              Note : {{ note }}<br>
              Témoignage : {{ temoignage }}
            </Text>
          </Section>
        </Section>

        <!-- Footer -->
        <Section style="padding: 24px 48px 40px 48px;">
          <Hr style="border: none; border-top: 1px solid #e5effa; margin: 0 0 24px 0;" />
          <Text style="color: #7a8aaa; font-size: 12px; text-align: center; margin: 0; padding: 0; line-height: 1.6;">
            <Link href="https://luminaconsulting.fr" style="color: #89c8ef; text-decoration: none;">
              luminaconsulting.fr
            </Link>
            &nbsp;·&nbsp; © 2026 Lumina Consulting
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
