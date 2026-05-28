/**
 * Common English words for the standard-English typing baseline.
 * Curated from the most frequent words in everyday English (MonkeyType-style
 * `english` list spirit) — short, high-frequency, lowercase, no punctuation, so
 * the baseline isolates raw typing throughput from symbol/reach difficulty.
 */
export const COMMON_ENGLISH_WORDS: readonly string[] = [
  "the", "of", "and", "a", "to", "in", "is", "you", "that", "it",
  "he", "was", "for", "on", "are", "as", "with", "his", "they", "i",
  "at", "be", "this", "have", "from", "or", "one", "had", "by", "word",
  "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
  "there", "use", "an", "each", "which", "she", "do", "how", "their", "if",
  "will", "up", "other", "about", "out", "many", "then", "them", "these", "so",
  "some", "her", "would", "make", "like", "him", "into", "time", "has", "look",
  "two", "more", "write", "go", "see", "number", "no", "way", "could", "people",
  "my", "than", "first", "water", "been", "call", "who", "oil", "its", "now",
  "find", "long", "down", "day", "did", "get", "come", "made", "may", "part",
  "over", "new", "sound", "take", "only", "little", "work", "know", "place", "year",
  "live", "me", "back", "give", "most", "very", "after", "thing", "our", "just",
  "name", "good", "sentence", "man", "think", "say", "great", "where", "help", "through",
  "much", "before", "line", "right", "too", "mean", "old", "any", "same", "tell",
  "boy", "follow", "came", "want", "show", "also", "around", "form", "three", "small",
  "set", "put", "end", "does", "another", "well", "large", "must", "big", "even",
  "such", "because", "turn", "here", "why", "ask", "went", "men", "read", "need",
  "land", "different", "home", "us", "move", "try", "kind", "hand", "picture", "again",
  "change", "off", "play", "spell", "air", "away", "animal", "house", "point", "page",
  "letter", "mother", "answer", "found", "study", "still", "learn", "should", "world", "high",
  "every", "near", "add", "food", "between", "own", "below", "country", "plant", "last",
  "school", "father", "keep", "tree", "never", "start", "city", "earth", "eye", "light",
  "thought", "head", "under", "story", "saw", "left", "few", "while", "along", "might",
  "close", "something", "seem", "next", "hard", "open", "example", "begin", "life", "always",
  "those", "both", "paper", "together", "got", "group", "often", "run", "important", "until",
];

const MIN_BUFFER = 220;

/**
 * Generates a long shuffled sequence of common words (space-joined). The buffer
 * is intentionally large so a 30s test never runs out of words for fast typists.
 */
export function generateEnglishWords(count = MIN_BUFFER): string[] {
  const words: string[] = [];
  const pool = COMMON_ENGLISH_WORDS;
  let prev = "";
  for (let i = 0; i < count; i++) {
    let w = pool[Math.floor(Math.random() * pool.length)];
    // Avoid immediate repeats so the line doesn't read "the the".
    if (w === prev) {
      w = pool[(pool.indexOf(w) + 1) % pool.length];
    }
    words.push(w);
    prev = w;
  }
  return words;
}
