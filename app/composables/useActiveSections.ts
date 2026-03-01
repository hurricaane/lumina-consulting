/**
 * Watches a list of section IDs with IntersectionObserver and tracks
 * which section is currently in view via shared state.
 * The URL is never modified — it only changes on explicit navigation clicks.
 *
 * State values:
 *   null  → top of page, Accueil active (path-based fallback in Header)
 *   "id"  → a section is visible
 *   ""    → past all sections (footer visible), nothing active
 */
export function useActiveSections(sectionIds: string[], clearId?: string) {
  const activeSection = useState<string | null>("activeSection", () => null);
  const observers: IntersectionObserver[] = [];

  onMounted(() => {
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el)
        return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activeSection.value = id;
            }
            else if (activeSection.value === id) {
              activeSection.value = null;
            }
          });
        },
        { threshold: 0.3 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    if (clearId) {
      const sentinel = document.getElementById(clearId);
      if (sentinel) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting)
                activeSection.value = "";
              else if (activeSection.value === "")
                activeSection.value = null;
            });
          },
          { threshold: 0 },
        );
        observer.observe(sentinel);
        observers.push(observer);
      }
    }
  });

  onUnmounted(() => {
    observers.forEach(o => o.disconnect());
  });
}
