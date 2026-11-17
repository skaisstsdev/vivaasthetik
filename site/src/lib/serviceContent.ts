// Разбирает HTML-текст услуги на главы (<h3>) и карточки (<h4> + текст под ним),
// чтобы страницу можно было разложить по сетке, а не вытягивать в один столбик.
export type ServiceCard = { title: string; html: string; important: boolean };
export type ServiceChapter = { title: string | null; html: string; cards: ServiceCard[] };

// Тексты про риски, побочные эффекты и противопоказания выделяются отдельным блоком.
const IMPORTANT = /Risiken|Nebenwirkung|Komplikation|keine Behandlung|nicht durchgeführt|Риск|побочн|осложн|противопоказ|не следует|нельзя/i;

const cleanTitle = (t: string) =>
  t.replace(/„\s+/g, '„').replace(/\s+“/g, '“').trim();

// Длинные списки (8+ пунктов) идут в две колонки, короткие — в одну.
const markLists = (html: string) =>
  html.replace(/<ul>([\s\S]*?)<\/ul>/g, (m, inner: string) =>
    (inner.match(/<li>/g) || []).length >= 8 ? `<ul class="list-cols">${inner}</ul>` : m,
  );

export function parseServiceContent(html: string): ServiceChapter[] {
  const parts = html.split(/(<h[34]>[\s\S]*?<\/h[34]>)/);
  const chapters: ServiceChapter[] = [];
  let chapter: ServiceChapter | null = null;
  let card: ServiceCard | null = null;

  const ensureChapter = () => {
    if (!chapter) {
      chapter = { title: null, html: '', cards: [] };
      chapters.push(chapter);
    }
    return chapter;
  };

  for (const part of parts) {
    const h3 = part.match(/^<h3>([\s\S]*?)<\/h3>$/);
    const h4 = part.match(/^<h4>([\s\S]*?)<\/h4>$/);
    if (h3) {
      chapter = { title: cleanTitle(h3[1]), html: '', cards: [] };
      chapters.push(chapter);
      card = null;
    } else if (h4) {
      const title = cleanTitle(h4[1]);
      card = { title, html: '', important: IMPORTANT.test(title) };
      ensureChapter().cards.push(card);
    } else if (part.trim()) {
      if (card) card.html += markLists(part);
      else ensureChapter().html += markLists(part);
    }
  }
  return chapters;
}
