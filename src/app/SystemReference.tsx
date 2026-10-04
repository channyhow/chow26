import businessContextsData from "@/data/businessContexts.json";

export function SystemReference() {
  return (
    <div className="systemReference">
      <section className="section borderTop">
        <div className="section__inner stack">
          <div className="textBlock">
            <p className="textBlock__eyebrow">UX / conversion</p>
            <h2 className="textBlock__title">Principles to protect across every client site.</h2>
          </div>
          <div className="grid systemReference__principles">
            {businessContextsData.principles.map((principle) => (
              <article className="card systemReference__card" key={principle.title}>
                <div className="card__body textBlock">
                  <h3 className="textBlock__title">{principle.title}</h3>
                  <p className="textBlock__text">{principle.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__inner stack">
          <div className="textBlock">
            <p className="textBlock__eyebrow">Business contexts</p>
            <h2 className="textBlock__title">Choose components from the conversion problem, not the industry label.</h2>
            <p className="textBlock__text">These are starting hierarchies, not fixed templates. Reorder or remove sections according to the actual user journey.</p>
          </div>

          <div className="systemReference__contexts">
            {businessContextsData.contexts.map((context) => (
              <article className="systemReference__context" key={context.id}>
                <header className="stack">
                  <p className="textBlock__eyebrow">{context.label}</p>
                  <h3>{context.goal}</h3>
                </header>
                <ol className="systemReference__hierarchy">
                  {context.hierarchy.map((step) => <li key={step}>{step}</li>)}
                </ol>
                <p><strong>Prioritise:</strong> {context.priorityComponents.join(" · ")}</p>
                <p className="systemReference__note">{context.conversionNote}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
