import * as prismic from "@prismicio/client";

export default defineSitemapEventHandler(async () => {
  const client = prismic.createClient("lumina-consulting", {
    routes: [
      { type: "page", uid: "home", path: "/" },
      { type: "page", path: "/:uid" },
    ],
  });

  const pages = await client.getAllByType("page");

  return pages.map(page => asSitemapUrl({
    loc: prismic.asLink(page) || `/${page.uid}`,
    lastmod: page.last_publication_date
      ? new Date(page.last_publication_date).toISOString()
      : undefined,
  }));
});
