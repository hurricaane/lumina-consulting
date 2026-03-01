/**
 * Watches a list of section IDs with IntersectionObserver and tracks
 * which section is currently in view via shared state.
 * The URL is never modified — it only changes on explicit navigation clicks.
 */
export function useActiveSections(sectionIds: string[]) {
  const activeSection = useState<string>("activeSection", () => "");
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
              activeSection.value = "";
            }
          });
        },
        { threshold: 0.3 },
      );

      observer.observe(el);
      observers.push(observer);
    });
  });

  onUnmounted(() => {
    observers.forEach(o => o.disconnect());
  });
}
