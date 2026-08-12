# SEO, discoverability and public metadata

The starter treats SEO metadata as data, not scattered markup.

## Source of truth

Use `src/data/site.json` for site-wide identity/defaults and `src/data/pages.json` for page-specific SEO.

`site.json` owns:

- canonical production URL;
- site/business name and baseline;
- default title and description;
- default social image + alt text;
- theme color;
- schema.org organization type;
- service areas;
- expertise/topics;
- service catalogue;
- Twitter card type;
- PWA name/short name/description;
- contact/address/social identity used by structured data;
- creator/site credit used for website attribution.

`pages.json` owns:

- route title;
- route description;
- optional social image;
- optional canonical override;
- `index/follow` policy.

Do not duplicate those facts in React components or hand-edit generated public metadata after changing the JSON source.

## Semantic structured-data fields

Keep business data readable and provider-independent. Do not paste hand-written JSON-LD into client templates.

Example:

```json
{
  "seo": {
    "organizationType": "ProfessionalService",
    "areaServed": [
      { "kind": "city", "name": "Ville principale" },
      { "kind": "city", "name": "Ville secondaire" }
    ],
    "knowsAbout": [
      "Service principal",
      "Spécialité principale"
    ],
    "offerCatalogName": "Services et offres principales",
    "services": [
      {
        "name": "Service principal",
        "description": "Description courte du service."
      }
    ]
  }
}
```

Supported `areaServed.kind` values are `city`, `region`, `country`, and `place`. The SEO layer translates those semantic values into Schema.org types.

For a yoga business this can represent practice types and nearby cities; for a restaurant, dining/services and service area; for an architect, project expertise and geographic coverage; for an association, mission/programmes and territory; for commerce, product/service expertise and market area.

Only include claims that are true and useful. Structured data should describe visible, substantiated business information rather than add hidden marketing claims.

## Generated public files

`npm run seo:generate` writes the following from `site.json` + `pages.json`:

- `public/site.webmanifest`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/llms.txt`

Generation runs automatically before `npm run dev` and `npm run build`.

`llms.txt` includes public routes plus configured services, expertise and areas served, keeping agent-facing summaries aligned with the same source data.

`/system`, `/branding`, and the Netlify form detector page are disallowed in `robots.txt`. Pages with `seo.robots.index: false` are excluded from the sitemap.

## Index/head metadata

`index.html` contains semantic placeholders. The custom Vite index plugin replaces them from `site.json` during dev/build, including:

- document language;
- title/description;
- canonical URL;
- robots default;
- theme color;
- favicon/manifest links;
- Open Graph metadata;
- Twitter card metadata;
- rich JSON-LD for the organization/business and WebSite.

React route changes use `src/components/page/Seo.tsx` to keep title, description, canonical, robots and social metadata aligned with each page in `pages.json`.

## Structured data

The starter generates a Schema.org graph from semantic business data.

The configured business node can include:

- the configured organization/business type;
- stable `#business` identifier;
- business name and canonical URL;
- description;
- email/telephone;
- image;
- PostalAddress;
- enabled social profiles via `sameAs`;
- `areaServed` from configured places;
- `knowsAbout` from configured expertise;
- `hasOfferCatalog` generated from configured services.

A linked `WebSite` node references the business as publisher and, when configured, credits Chow Studio/site credits through its `creator` property. This describes who created the website without implying that the studio created the client business itself.

Set `site.seo.organizationType` to the most accurate Schema.org type for the client, for example `Restaurant`, `Architect`, `ProfessionalService`, `MusicGroup`, `NGO`, or `Store`. Never claim properties the client cannot substantiate.

Do not manually maintain an additional JSON-LD block per client. Update `site.json`; the generator owns Schema.org syntax. This prevents invalid commas, stale URLs and duplicated facts.

## Favicons and social images

`public/favicon.svg` and `public/media/placeholders/og-placeholder.svg` are development placeholders only.

Before launch:

1. generate the final favicon package with favicon.io;
2. place final favicon assets at the `public/` root;
3. update the manifest icon list if PNG/maskable icons are added;
4. replace the social placeholder with a real 1200×630 image (prefer JPG/WebP/PNG for broad crawler support);
5. update `site.seo.defaultImage` and any page-specific `seo.image` values;
6. validate the deployed Open Graph image with social preview tools.

## Launch SEO checklist

- Production `site.url` is exact HTTPS canonical domain, with no preview URL.
- Home defaults in `site.seo` match the homepage SEO in `pages.json`.
- Every indexable page has a unique useful title and description.
- Canonicals resolve to the intended production route.
- Internal/review pages are `noindex` and absent from sitemap.
- `robots.txt` references the production sitemap.
- `sitemap.xml` contains only canonical indexable routes.
- Structured data uses truthful business type/contact/address/social details.
- `areaServed`, `knowsAbout`, and services reflect visible client content.
- Website creator attribution points to the intended Chow Studio URL.
- Final favicon and social image replace placeholders.
- Heading hierarchy and visible page copy match the page's search intent.
- Meaningful images have useful alt text; decorative imagery remains decorative.
- Links use descriptive labels rather than generic repeated text where practical.
- Real content is server-accessible in the rendered application and does not depend on hover/motion to be understood.
- Validate JSON-LD with Google's Rich Results Test / Schema.org validator where appropriate.
- Lighthouse and Search Console checks are performed on the deployed production domain.

## Agent discoverability

`llms.txt` is generated as a lightweight machine-readable summary of public pages, services, expertise, areas served and basic site identity. It supplements, but does not replace, semantic HTML, structured data, sitemap, robots rules, or accessible visible content.

The strongest agent/search discoverability still comes from consistent semantic data, clear headings, real links, descriptive content, truthful structured data and crawlable canonical URLs.
