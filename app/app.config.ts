export default defineAppConfig({
  ui: {
    colors: {
      primary: "lumina",
    },
    navigationMenu: {
      slots: {
        list: "items-center gap-8 isolate min-w-0",
      },
      compoundVariants: [
        {
          orientation: "horizontal",
          variant: "link",
          active: false,
          class: {
            link: "hover:text-primary",
          },
        },
        {
          highlight: true,
          active: true,
          orientation: "horizontal",
          class: {
            link: [
              "after:-bottom-0.5 after:h-[2px] after:bg-primary",
              "after:transition-transform after:duration-300",
            ],
          },
        },
      ],
    },
  },
});
