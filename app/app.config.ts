export default defineAppConfig({
  ui: {
    colors: {
      primary: "lumina",
    },
    header: {
      slots: {
        title: "shrink-0 flex items-center gap-1.5",
      },
    },
    navigationMenu: {
      slots: {
        list: "items-center gap-8 isolate min-w-0",
        // transition-colors always present so text color animates in both directions
        link: "transition-colors duration-300",
      },
      compoundVariants: [
        {
          orientation: "horizontal",
          variant: "link",
          active: false,
          class: {
            link: [
              "hover:text-primary",
              // after: always present — scaleX: 0 = hidden, ready to animate in
              "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-primary",
              "after:scale-x-0 after:origin-left",
              "after:transition-transform after:duration-[400ms] after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
            ],
          },
        },
        {
          highlight: true,
          active: true,
          orientation: "horizontal",
          class: {
            link: [
              "text-primary",
              // after: always present — scaleX: 1 = visible, mirror of inactive state
              "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-primary",
              "after:scale-x-100 after:origin-left",
              "after:transition-transform after:duration-[400ms] after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
            ],
          },
        },
      ],
    },
  },
});
