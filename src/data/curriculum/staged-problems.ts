import { stagedSnippet } from "@/lib/snippet-stages";

/** Progressive multi-gate problems for Anthropic/OpenAI tracks (June 2026 formats). */
export const STAGED_SNIPPETS = [
  stagedSnippet({
    id: "anthropic-kv-store",
    title: "In-Memory KV Store",
    pattern: "hash-map",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["hash-lookup", "counter-defaultdict"],
    packIds: ["company-anthropic"],
    description: "Multi-stage system build — canonical Anthropic-style escalation.",
    stages: [
      {
        id: "basic",
        requirement: "Stage 1: Implement basic set and get.",
        code: `class KVStore:
    def __init__(self) -> None:
        self._data: dict[str, str] = {}

    def set(self, key: str, value: str) -> None:
        self._data[key] = value

    def get(self, key: str) -> str | None:
        return self._data.get(key)
`,
      },
      {
        id: "sorted-list",
        requirement: "Stage 2: Add list_keys() returning keys sorted lexicographically.",
        code: `class KVStore:
    def __init__(self) -> None:
        self._data: dict[str, str] = {}

    def set(self, key: str, value: str) -> None:
        self._data[key] = value

    def get(self, key: str) -> str | None:
        return self._data.get(key)

    def list_keys(self) -> list[str]:
        return sorted(self._data.keys())
`,
      },
      {
        id: "ttl",
        requirement: "Stage 3: Add TTL — set(key, value, ttl_sec) and expire stale keys on read.",
        code: `import time

class KVStore:
    def __init__(self) -> None:
        self._data: dict[str, tuple[str, float | None]] = {}

    def set(self, key: str, value: str, ttl_sec: float | None = None) -> None:
        expires = None if ttl_sec is None else time.time() + ttl_sec
        self._data[key] = (value, expires)

    def get(self, key: str) -> str | None:
        item = self._data.get(key)
        if item is None:
            return None
        value, expires = item
        if expires is not None and time.time() >= expires:
            del self._data[key]
            return None
        return value

    def list_keys(self) -> list[str]:
        now = time.time()
        live = [k for k, (_, exp) in self._data.items() if exp is None or now < exp]
        return sorted(live)
`,
      },
    ],
  }),

  stagedSnippet({
    id: "anthropic-rate-limiter",
    title: "Token Bucket Rate Limiter",
    pattern: "stack",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["deque-window", "counter-defaultdict"],
    packIds: ["company-anthropic"],
    description: "Concurrency-friendly rate limiting in pure Python.",
    stages: [
      {
        id: "allow",
        requirement: "Stage 1: Fixed-window allow(n) returning True if n requests fit.",
        code: `import time

class RateLimiter:
    def __init__(self, max_requests: int, window_sec: float) -> None:
        self._max = max_requests
        self._window = window_sec
        self._count = 0
        self._window_start = time.monotonic()

    def allow(self, n: int = 1) -> bool:
        now = time.monotonic()
        if now - self._window_start >= self._window:
            self._window_start = now
            self._count = 0
        if self._count + n > self._max:
            return False
        self._count += n
        return True
`,
      },
      {
        id: "retry-after",
        requirement: "Stage 2: Return seconds until retry when denied (retry_after()).",
        code: `import time

class RateLimiter:
    def __init__(self, max_requests: int, window_sec: float) -> None:
        self._max = max_requests
        self._window = window_sec
        self._count = 0
        self._window_start = time.monotonic()

    def allow(self, n: int = 1) -> bool:
        now = time.monotonic()
        if now - self._window_start >= self._window:
            self._window_start = now
            self._count = 0
        if self._count + n > self._max:
            return False
        self._count += n
        return True

    def retry_after(self) -> float:
        elapsed = time.monotonic() - self._window_start
        return max(0.0, self._window - elapsed)
`,
      },
    ],
  }),

  stagedSnippet({
    id: "anthropic-config-store",
    title: "File-Backed Config Store",
    pattern: "hash-map",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["hash-lookup"],
    packIds: ["company-anthropic"],
    description: "Load and validate configuration from disk.",
    stages: [
      {
        id: "load",
        requirement: "Stage 1: Load key=value lines from a file into memory.",
        code: `from pathlib import Path

class ConfigStore:
    def __init__(self) -> None:
        self._values: dict[str, str] = {}

    def load(self, path: Path) -> None:
        self._values.clear()
        for line in path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, _, value = line.partition("=")
            self._values[key.strip()] = value.strip()

    def get(self, key: str, default: str = "") -> str:
        return self._values.get(key, default)
`,
      },
      {
        id: "validate",
        requirement: "Stage 2: Reject load when required keys are missing.",
        code: `from pathlib import Path

class ConfigStore:
    def __init__(self, required: set[str] | None = None) -> None:
        self._values: dict[str, str] = {}
        self._required = required or set()

    def load(self, path: Path) -> None:
        self._values.clear()
        for line in path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, _, value = line.partition("=")
            self._values[key.strip()] = value.strip()
        missing = self._required - self._values.keys()
        if missing:
            raise ValueError(f"missing keys: {sorted(missing)}")

    def get(self, key: str, default: str = "") -> str:
        return self._values.get(key, default)
`,
      },
    ],
  }),

  stagedSnippet({
    id: "openai-timed-kv",
    title: "Time-Based Key-Value Store",
    pattern: "hash-map",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["hash-lookup", "counter-defaultdict"],
    packIds: ["company-openai"],
    description: "OpenAI canonical progressive KV with timestamps.",
    stages: [
      {
        id: "timestamped-set",
        requirement: "Stage 1: set(key, value, timestamp) and get at a query time.",
        code: `class TimeMap:
    def __init__(self) -> None:
        self._series: dict[str, list[tuple[int, str]]] = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self._series.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self._series.get(key, [])
        result = ""
        for ts, val in entries:
            if ts <= timestamp:
                result = val
            else:
                break
        return result
`,
      },
      {
        id: "delete",
        requirement: "Stage 2: Add delete(key, timestamp) removing entries at or after ts.",
        code: `class TimeMap:
    def __init__(self) -> None:
        self._series: dict[str, list[tuple[int, str]]] = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self._series.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self._series.get(key, [])
        result = ""
        for ts, val in entries:
            if ts <= timestamp:
                result = val
            else:
                break
        return result

    def delete(self, key: str, timestamp: int) -> None:
        if key not in self._series:
            return
        self._series[key] = [(ts, val) for ts, val in self._series[key] if ts < timestamp]
`,
      },
      {
        id: "floor-get",
        requirement: "Stage 3: get returns empty string when key absent at timestamp.",
        code: `class TimeMap:
    def __init__(self) -> None:
        self._series: dict[str, list[tuple[int, str]]] = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self._series.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self._series.get(key)
        if not entries:
            return ""
        result = ""
        for ts, val in entries:
            if ts <= timestamp:
                result = val
            else:
                break
        return result

    def delete(self, key: str, timestamp: int) -> None:
        if key not in self._series:
            return
        self._series[key] = [(ts, val) for ts, val in self._series[key] if ts < timestamp]
`,
      },
    ],
  }),

  stagedSnippet({
    id: "openai-resumable-iterator",
    title: "Resumable Iterator",
    pattern: "arrays",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["enumerate-index"],
    packIds: ["company-openai"],
    description: "Checkpoint and resume iteration over a data source.",
    stages: [
      {
        id: "basic",
        requirement: "Stage 1: Iterator with next(), has_next(), and checkpoint().",
        code: `class ResumableIterator:
    def __init__(self, items: list[int]) -> None:
        self._items = items
        self._index = 0

    def has_next(self) -> bool:
        return self._index < len(self._items)

    def next(self) -> int:
        if not self.has_next():
            raise StopIteration
        value = self._items[self._index]
        self._index += 1
        return value

    def checkpoint(self) -> int:
        return self._index
`,
      },
      {
        id: "resume",
        requirement: "Stage 2: Add resume(index) to continue from a saved checkpoint.",
        code: `class ResumableIterator:
    def __init__(self, items: list[int]) -> None:
        self._items = items
        self._index = 0

    def has_next(self) -> bool:
        return self._index < len(self._items)

    def next(self) -> int:
        if not self.has_next():
            raise StopIteration
        value = self._items[self._index]
        self._index += 1
        return value

    def checkpoint(self) -> int:
        return self._index

    def resume(self, index: int) -> None:
        if index < 0 or index > len(self._items):
            raise ValueError("invalid checkpoint")
        self._index = index
`,
      },
    ],
  }),

  stagedSnippet({
    id: "openai-sliding-rate-limiter",
    title: "Sliding-Window Rate Limiter",
    pattern: "stack",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["deque-window"],
    packIds: ["company-openai"],
    description: "Sliding-window request limiter — OpenAI infra pattern.",
    stages: [
      {
        id: "sliding-allow",
        requirement: "Stage 1: allow() using a sliding window of timestamps.",
        code: `import time
from collections import deque

class SlidingRateLimiter:
    def __init__(self, max_requests: int, window_sec: float) -> None:
        self._max = max_requests
        self._window = window_sec
        self._times: deque[float] = deque()

    def allow(self) -> bool:
        now = time.monotonic()
        while self._times and now - self._times[0] >= self._window:
            self._times.popleft()
        if len(self._times) >= self._max:
            return False
        self._times.append(now)
        return True
`,
      },
      {
        id: "remaining",
        requirement: "Stage 2: Expose remaining() slots left in the current window.",
        code: `import time
from collections import deque

class SlidingRateLimiter:
    def __init__(self, max_requests: int, window_sec: float) -> None:
        self._max = max_requests
        self._window = window_sec
        self._times: deque[float] = deque()

    def _prune(self, now: float) -> None:
        while self._times and now - self._times[0] >= self._window:
            self._times.popleft()

    def allow(self) -> bool:
        now = time.monotonic()
        self._prune(now)
        if len(self._times) >= self._max:
            return False
        self._times.append(now)
        return True

    def remaining(self) -> int:
        now = time.monotonic()
        self._prune(now)
        return max(0, self._max - len(self._times))
`,
      },
    ],
  }),
];
