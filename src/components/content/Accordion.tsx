export type AccordionItem = {
  id: string;
  title: string;
  content: string;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="accordion">
      {items.map((item) => (
        <details className="accordion__item" key={item.id}>
          <summary className="accordion__summary">{item.title}</summary>
          <div className="accordion__content">
            <div className="accordion__contentInner"><p>{item.content}</p></div>
          </div>
        </details>
      ))}
    </div>
  );
}
