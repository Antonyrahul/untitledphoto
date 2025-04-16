import { prompts } from "@/core/utils/prompts";
import { GetServerSidePropsContext } from "next";
import { TPrompt } from "./prompts/dreambooth/[slug]";

function SiteMap() {}

function generateSiteMap(prompts: TPrompt[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://untitled1.in</loc>
     </url>
     <url>
       <loc>https://untitled1.in/terms</loc>
     </url>
      <url>
       <loc>https://untitled1.in/faq</loc>
     </url>
     <url>
       <loc>https://untitled1.in/prompts</loc>
     </url>
     <url>
       <loc>https://untitled1.in/how-it-works</loc>
     </url>
     ${prompts
       .map(({ slug }) => {
         return `
       <url>
           <loc>https://untitled1.in/prompts/dreambooth/${slug}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  const sitemap = generateSiteMap(prompts);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
