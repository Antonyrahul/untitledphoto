import Head from "next/head";
import React from "react";

const title = "Generate beautiful headshots - Superrshots";
const description =
  "Generate beautiful headshots with our unique headshot generator.";
const image = "https://hedshottempbucket.s3.ap-south-1.amazonaws.com/superrshot.jpg";

const DefaultHead = () => (
  <Head>
    <title>{title}</title>
    <link rel="shortcut icon" href="/icon.png" />
    <meta name="description" content={description} />
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta itemProp="image" content={image} />
    <meta property="og:logo" content={image}></meta>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@shinework" />
    <meta name="twitter:creator" content="@shinework" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
  </Head>
);

export default DefaultHead;
