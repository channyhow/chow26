import { useState } from "react";

const colors = ["Charcoal", "Chalk", "Burnt orange", "Sand", "Stone", "Mist", "Warm ivory"];
const sizes = [["Display XL", "display-xl", "64–128px"], ["Display L", "display-lg", "52–96px"], ["Heading XL", "heading-xl", "44–72px"], ["Heading L", "heading-lg", "32–48px"], ["Heading M", "heading-md", "24–32px"], ["Heading S", "heading-sm", "20–24px"], ["Navigation", "nav", "20px"], ["Action", "action", "20px"], ["Body", "body", "18–22px"], ["Caption", "caption", "12–13px"]];
function Swatch({ name, index }: { name: string; index: number }) {
  const [status, setStatus] = useState("");
  const [hex, setHex] = useState("");
  return <button type="button" className="brandGuide__swatch" data-swatch={index} ref={(node) => {
    if (!node) return;
    const rgb = getComputedStyle(node).backgroundColor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const value = "#" + rgb.slice(0, 3).map((v) => Number(v).toString(16).padStart(2, "0")).join("").toUpperCase();
      if (value !== hex) setHex(value);
    }
  }} onClick={async () => { try { await navigator.clipboard.writeText(hex); setStatus("Copied"); } catch { setStatus("Copy unavailable"); } }}>
    <strong>{name}</strong><span>{hex}</span><small aria-live="polite">{status || "Copy HEX"}</small>
  </button>;
}
export function BrandGuidePage() {
  return <article className="brandGuide">
    <header className="brandGuide__hero"><p>Visual identity / Version 1.0</p><h1>CHOW STUDIO</h1><p>Identité visuelle | Design web</p></header>
    <nav aria-label="Brand guide sections" className="brandGuide__nav">{["Direction", "Palette", "Typography", "Rhythm", "Applications", "Rules"].map((s) => <a key={s} href={"#" + s.toLowerCase()}>{s}</a>)}</nav>
    <section id="direction"><h2>01 / Direction</h2><p>Editorial, assertive, contemporary and warm. Scale, typography and composition are the signature. Use asymmetry, generous negative space and tactile imagery; preserve each client's own identity.</p></section>
    <section id="palette"><h2>02 / Palette</h2><h3>Primary palette</h3><div className="brandGuide__palette brandGuide__palette--primary">{[2,0,6].map(index => <Swatch key={colors[index]} name={colors[index]} index={index} />)}</div><p>Burnt orange, charcoal and warm ivory define the studio identity across stationery, social media and communication.</p><h3>Secondary palette</h3><div className="brandGuide__palette brandGuide__palette--secondary">{[1,3,4,5].map(index => <Swatch key={colors[index]} name={colors[index]} index={index} />)}</div><p>Chalk is the primary digital background, sand supports editorial surfaces, stone is for secondary information and mist for borders and separators.</p></section>
    <section id="typography"><h2>03 / Typography</h2><div className="brandGuide__families"><div><h3>OSWALD</h3><p>400 / 500 / 600 / 700</p></div><div><p className="brandGuide__plex">IBM Plex Sans</p><p>400 / 500 / 600 / 700</p></div></div><div className="brandGuide__samples">{sizes.map(([label,role,size]) => <div key={role}><small>{label} / {size}</small><p data-type={role}>{role === "body" || role === "caption" ? "Une identité claire et cohérente." : "CHOW STUDIO"}</p></div>)}</div><p>Headings: 115% leading, −10 Adobe tracking. Navigation: 120%, +15. Actions: 115%, +15. Body: 150%, normal tracking. Caption: 140%. Header wordmark and navigation share Oswald 500.</p></section>
    <section id="rhythm"><h2>04 / Rhythm</h2><div className="brandGuide__rhythm">{[8,16,32,64,96,128].map((n,i) => <div key={n}><span>{n}px</span><i data-space={i}/></div>)}</div><p>Grid: 4 mobile / 8 tablet / 12 desktop. Gutters 16–64px. Motion: 60ms stagger, 180ms hover, 360ms interface, 640ms reveal.</p></section>
    <section id="applications"><h2>05 / Applications</h2><div className="brandGuide__applications"><div><strong>CHOW<br/>STUDIO</strong><small>IDENTITÉ VISUELLE</small></div><div><strong>DES IDENTITÉS<br/>QUI ONT DU SENS.</strong><small>STUDIO / 01</small></div><div><strong>FORME &<br/>MATIÈRE</strong><small>PROCESSUS / 02</small></div></div><p>Social studies: 1080 × 1350px, six columns, 72px margins, 24px gutters. Stories 1080 × 1920px. Display 112px+, headlines 72–112px, body 32–40px, labels 24–32px. Alternate project imagery, statements and process.</p><h3>Business cards</h3>
      <div className="brandGuide__cards">
        <figure><div className="brandGuide__card brandGuide__card--front"><strong className="brandGuide__cardWordmark">CHOW STUDIO</strong><span className="brandGuide__cardBaseline">IDENTITÉ VISUELLE | DESIGN WEB</span></div><figcaption>Recto / Burnt orange</figcaption></figure>
        <figure><div className="brandGuide__card brandGuide__card--back"><strong className="brandGuide__cardName">CHANNY HOW</strong><span className="brandGuide__cardRole">Designer graphique &amp; web</span><div className="brandGuide__cardContact">channy@chow-studio.com<br/>chow-studio.com<br/>@hellochowstudio</div><strong className="brandGuide__cardVertical">CHOW STUDIO</strong></div><figcaption>Verso / Warm ivory</figcaption></figure>
      </div><p>Screen reconstruction of the stationery artwork using the studio palette. Print colours remain subject to proofing.</p><p>Proposed 85 × 55mm, orange recto and warm light verso, horizontal and vertical wordmark, matte textured stock and coloured edges. Confirm print colours, bleed and physical proof with printer.</p></section>
    <section id="rules"><h2>06 / Rules</h2><p>Use oversized typography, fine rules, square-edged imagery, natural light and subtle grain. Avoid decorative arrows, extra fonts, gradients and unnecessary containers. Master vector logotypes and production templates remain pending.</p><p><a href="https://app.notion.com/p/425c5c41a01181308fd3c42f1074be86?pvs=204">Full guidelines in Notion</a></p></section>
  </article>;
}
