<script setup lang="ts">
import type { Easing } from "motion-v";

import { motion } from "motion-v";

useSeoMeta({
  title: "Conditions générales de vente — Lumina Consulting",
  description: "Conditions générales de vente de Lumina Consulting, studio de création de sites web sur mesure.",
});

const ease: Easing = [0.16, 1, 0.3, 1];

type LegalSection = {
  number: string;
  title: string;
  body: string;
};

const sections: LegalSection[] = [
  {
    number: "01",
    title: "Objet et champ d'application",
    body: "Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les prestations proposées par Yannick Dossou, entrepreneur individuel opérant sous l'enseigne Lumina Consulting (ci-après « le Prestataire »), dans le cadre de la création de sites web et du design numérique. Toute commande passée auprès du Prestataire implique l'acceptation pleine et sans réserve des présentes CGV, qui prévalent sur tout autre document du client sauf accord écrit contraire.",
  },
  {
    number: "02",
    title: "Devis et acceptation de commande",
    body: "Toute prestation fait l'objet d'un devis détaillé établi sur la base d'un cahier des charges transmis par le client, valable 30 jours à compter de sa date d'émission. Le devis peut être révisé en cas de modification du cahier des charges. Il devient contractuel dès sa signature par le client, accompagnée du versement de l'acompte prévu à l'article 03 et de la remise de l'ensemble des éléments nécessaires au démarrage. Le Prestataire se réserve le droit de refuser toute commande sans avoir à se justifier.",
  },
  {
    number: "03",
    title: "Tarifs et conditions de paiement",
    body: "Les prix sont exprimés en euros. Un acompte de 30 % du montant total est exigé à la signature du devis pour démarrer la prestation ; cet acompte est acquis de plein droit au Prestataire et ne donne lieu à aucun remboursement en cas d'abandon à l'initiative du client. Le solde est dû dans un délai de 15 jours suivant la livraison du projet finalisé. Le paiement s'effectue par virement bancaire aux coordonnées figurant sur la facture. Tout retard de paiement entraîne de plein droit, sans mise en demeure préalable, des pénalités calculées au taux légal en vigueur ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 €, conformément à l'article L. 441-10 du Code de commerce.",
  },
  {
    number: "04",
    title: "Délais de réalisation",
    body: "Les délais de réalisation sont définis dans le devis et s'entendent en jours ouvrés. Ils sont conditionnés à la remise dans les délais convenus des contenus, éléments graphiques, accès et validations nécessaires par le client. Tout retard imputable au client — notamment l'absence de retours dans les délais ou la transmission tardive des éléments — entraîne de plein droit un décalage équivalent des délais de livraison, sans pénalité pour le Prestataire. L'absence de retour du client dans un délai de 15 jours calendaires après une demande de validation vaut acceptation tacite du livrable concerné.",
  },
  {
    number: "05",
    title: "Révisions et modifications",
    body: "Deux allers-retours de corrections sont inclus dans chaque prestation, sur la base d'une liste de retours écrite, claire et consolidée transmise en une seule fois par le client. Les corrections mineures (ajustements de texte, de couleurs dans la charte définie, d'espacement) sont incluses dans ces allers-retours. Toute demande de modification substantielle dépassant le cadre du cahier des charges initial — notamment un changement de direction créative, une refonte partielle ou l'ajout de fonctionnalités non prévues — fera l'objet d'un devis complémentaire.",
  },
  {
    number: "06",
    title: "Abandon et résiliation",
    body: "Si le client décide d'interrompre le projet en cours d'exécution, les livrables réalisés jusqu'à la date de notification d'abandon sont facturés à hauteur de 50 % de leur valeur telle que définie dans le devis initial. L'acompte versé est définitivement acquis au Prestataire. En cas de résiliation à l'initiative du Prestataire pour manquement grave du client à ses obligations (absence de paiement, fourniture de contenus illicites, comportement rendant la collaboration impossible), les sommes correspondant aux livrables non fournis sont remboursées au prorata.",
  },
  {
    number: "07",
    title: "Droit de rétractation",
    body: "Conformément aux articles L.221-18 et suivants du Code de la consommation, les clients particuliers (personnes physiques n'agissant pas à titre professionnel) disposent d'un délai de 14 jours calendaires à compter de la signature du devis pour exercer leur droit de rétractation, sans justification ni pénalité. Toutefois, si le client demande expressément et par écrit le démarrage de la prestation avant l'expiration de ce délai, il reconnaît renoncer à ce droit pour la part de prestation déjà exécutée et sera facturé au prorata. Cette disposition ne s'applique pas aux clients agissant à titre professionnel.",
  },
  {
    number: "08",
    title: "Propriété intellectuelle",
    body: "Les créations réalisées par le Prestataire restent sa propriété exclusive jusqu'au règlement intégral de la facture. Après paiement complet, les droits d'exploitation du projet livré sont cédés au client pour un usage illimité dans le cadre de l'activité décrite dans le devis. Conformément au Code de la propriété intellectuelle, le droit moral reste attaché à l'auteur de manière perpétuelle et inaliénable. Les droits économiques cédés portent exclusivement sur les supports, territoires et durées d'utilisation définis au devis.",
  },
  {
    number: "09",
    title: "Fichiers sources",
    body: "Sauf mention contraire expressément stipulée et acceptée dans le devis, les fichiers sources et de travail — fichiers de conception, maquettes modifiables, code source non compilé, bibliothèques internes — demeurent la propriété du Prestataire. Seuls les fichiers finaux livrés (exports, build de production, formats exploitables) sont transmis au client. La remise des fichiers sources peut faire l'objet d'un accord complémentaire et d'une facturation spécifique, à convenir par écrit.",
  },
  {
    number: "10",
    title: "Mention commerciale et droit de portfolio",
    body: "Le Prestataire se réserve le droit de faire figurer, de manière discrète, une mention de sa contribution sur les réalisations livrées (par exemple « Création : Lumina Consulting »). Le client peut s'y opposer par demande écrite formulée avant la livraison finale. Par défaut, le Prestataire est autorisé à référencer, présenter et reproduire le projet réalisé dans son portfolio, ses supports de communication et ses références commerciales, à des fins de promotion de son activité.",
  },
  {
    number: "11",
    title: "Incapacité de travail",
    body: "En cas d'incapacité de travail du Prestataire due à une maladie, un accident ou une circonstance médicale imprévue, celui-ci en informera le client dans les meilleurs délais. Les délais de réalisation seront automatiquement décalés à due concurrence, sans que cela ne constitue une faute contractuelle ni n'entraîne d'indemnisation au bénéfice du client. Les parties rechercheront conjointement un nouvel échéancier adapté.",
  },
  {
    number: "12",
    title: "Responsabilité",
    body: "Le Prestataire s'engage à apporter tout le soin et la diligence nécessaires à la bonne exécution des prestations, dans le cadre d'une obligation de moyens. Sa responsabilité est limitée au montant des sommes effectivement perçues au titre de la commande concernée. Le Prestataire ne pourra être tenu responsable des préjudices indirects, des pertes d'exploitation, de données ou de chiffre d'affaires, ni des conséquences résultant des contenus fournis par le client ou de l'usage fait des livrables après livraison.",
  },
  {
    number: "13",
    title: "Force majeure",
    body: "Aucune des parties ne pourra être tenue responsable d'un manquement à ses obligations contractuelles résultant d'un événement de force majeure tel que défini par l'article 1218 du Code civil — notamment pandémies, catastrophes naturelles, grèves générales ou défaillances prolongées d'infrastructures numériques. La partie concernée en informe l'autre dans les deux jours ouvrés suivant la survenance de l'événement, et les parties rechercheront ensemble une solution adaptée.",
  },
  {
    number: "14",
    title: "Loi applicable et règlement des litiges",
    body: "Les présentes CGV sont soumises au droit français. En cas de litige relatif à leur interprétation ou leur exécution, les parties s'engagent à rechercher une solution amiable avant toute action contentieuse. À défaut d'accord dans un délai de 30 jours, les tribunaux compétents seront ceux du ressort du siège du Prestataire, à Nîmes (Gard), sauf disposition légale contraire applicable aux consommateurs — lesquels peuvent également recourir gratuitement à un médiateur de la consommation agréé.",
  },
];
</script>

<template>
  <section class="py-[clamp(4rem,8vw,7rem)]">
    <UContainer>
      <div class="max-w-[680px] mx-auto">

        <!-- ─── Back link ─────────────────────────────────────────── -->
        <motion.div
          :initial="{ opacity: 0, x: -10 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.45, ease }"
          class="mb-12"
        >
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-lumina-deep/35 hover:text-primary transition-colors duration-300 group"
          >
            <span class="group-hover:-translate-x-0.5 transition-transform duration-300 ease-out">←</span>
            <span>Accueil</span>
          </NuxtLink>
        </motion.div>

        <!-- ─── Page title ─────────────────────────────────────────── -->
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.65, delay: 0.07, ease }"
          class="mb-14 pb-10 border-b border-lumina-100"
        >
          <span class="section-label">Informations contractuelles</span>
          <h1 class="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium tracking-[-0.04em] leading-[1.08] text-lumina-deep italic mt-0">
            Conditions générales de vente
          </h1>
          <p class="mt-4 text-[0.8125rem] text-lumina-deep/35 tracking-[0.04em]">
            Dernière mise à jour · mars 2026
          </p>
        </motion.div>

        <!-- ─── Sections ───────────────────────────────────────────── -->
        <div>
          <motion.div
            v-for="(section, index) in sections"
            :key="section.number"
            :initial="{ opacity: 0, y: 14 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.55, delay: 0.14 + index * 0.07, ease }"
            class="py-9 border-b border-lumina-100"
          >
            <!-- Section header -->
            <div class="flex items-baseline gap-3.5 mb-5">
              <span class="font-display text-[0.625rem] tabular-nums text-lumina-300/70 shrink-0 leading-none">
                {{ section.number }}
              </span>
              <h2 class="section-label mb-0">
                {{ section.title }}
              </h2>
            </div>

            <!-- Prose body -->
            <p class="pl-[1.6rem] text-[0.9375rem] leading-[1.85] text-lumina-deep/60">
              {{ section.body }}
            </p>
          </motion.div>
        </div>

      </div>
    </UContainer>
  </section>
</template>
