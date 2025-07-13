// Lorem Ipsum text data
const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum"
];

const HIPSTER_WORDS = [
  "artisan", "craft", "organic", "sustainable", "locally", "sourced", "vintage",
  "authentic", "handmade", "bespoke", "curated", "artisanal", "farm-to-table",
  "small-batch", "single-origin", "fair-trade", "ethically", "conscious",
  "minimalist", "aesthetic", "boutique", "heritage", "traditional", "rustic",
  "bohemian", "eclectic", "innovative", "contemporary", "sustainable", "ethical"
];

const TECH_WORDS = [
  "algorithm", "blockchain", "cloud", "data", "encryption", "framework",
  "github", "hosting", "infrastructure", "javascript", "kubernetes", "linux",
  "machine", "learning", "network", "optimization", "protocol", "quantum",
  "repository", "scalability", "technology", "unicode", "virtual", "website",
  "xml", "yaml", "zip", "api", "backend", "frontend", "database", "server"
];

const STARTUP_WORDS = [
  "disruption", "innovation", "scalable", "agile", "pivot", "unicorn",
  "synergy", "leverage", "ecosystem", "viral", "growth", "hacking",
  "monetization", "freemium", "saas", "platform", "vertical", "horizontal",
  "b2b", "b2c", "mvp", "iteration", "sprint", "scrum", "kanban", "lean",
  "bootstrap", "venture", "capital", "funding", "round", "valuation"
];

export type ContentType = "lorem" | "hipster" | "tech" | "startup";
export type UnitType = "paragraphs" | "words" | "sentences";

const getWordList = (type: ContentType): string[] => {
  switch (type) {
    case "hipster": return HIPSTER_WORDS;
    case "tech": return TECH_WORDS;
    case "startup": return STARTUP_WORDS;
    default: return LOREM_WORDS;
  }
};

const getRandomWords = (wordList: string[], count: number): string[] => {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return result;
};

const generateSentence = (wordList: string[], minWords = 8, maxWords = 15): string => {
  const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = getRandomWords(wordList, wordCount);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
};

const generateParagraph = (wordList: string[], minSentences = 4, maxSentences = 8): string => {
  const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(wordList));
  }
  return sentences.join(" ");
};

export const generateText = (
  count: number,
  unit: UnitType,
  contentType: ContentType,
  includeHtml = false
): string => {
  const wordList = getWordList(contentType);
  let result = "";

  switch (unit) {
    case "words":
      result = getRandomWords(wordList, count).join(" ");
      break;
    
    case "sentences":
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(wordList));
      }
      result = sentences.join(" ");
      break;
    
    case "paragraphs":
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        const paragraph = generateParagraph(wordList);
        paragraphs.push(includeHtml ? `<p>${paragraph}</p>` : paragraph);
      }
      result = paragraphs.join(includeHtml ? "\n\n" : "\n\n");
      break;
    
    default:
      result = generateParagraph(wordList);
  }

  return result;
};