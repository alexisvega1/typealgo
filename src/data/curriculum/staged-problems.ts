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
    tracks: ["anthropic"],
    levelRange: ["mid"],
    sourceStyle: "Anthropic multi-tier KV → sorted keys → TTL escalation.",
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
    tracks: ["anthropic"],
    levelRange: ["mid"],
    sourceStyle: "Anthropic production rate limiter with explicit retry timing.",
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
    tracks: ["anthropic"],
    levelRange: ["mid"],
    sourceStyle: "Anthropic config store with required-key validation.",
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
    tracks: ["openai"],
    levelRange: ["mid"],
    sourceStyle: "OpenAI gate-style time-based KV with delete and absent-key edge case.",
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
    tracks: ["openai"],
    levelRange: ["mid"],
    sourceStyle: "OpenAI resumable iterator — checkpoint and resume gates.",
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
    tracks: ["openai"],
    levelRange: ["mid"],
    sourceStyle: "OpenAI sliding-window limiter with remaining capacity.",
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

  stagedSnippet({
    id: "anthropic-event-log",
    title: "Append-Only Event Log",
    pattern: "hash-map",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["enumerate-index", "counter-defaultdict"],
    packIds: ["company-anthropic"],
    tracks: ["anthropic"],
    levelRange: ["mid"],
    sourceStyle: "Anthropic L4 event log — append, replay, compact.",
    description: "Production event log with offset replay and compaction.",
    stages: [
      {
        id: "append",
        requirement: "Stage 1: append(event) assigns monotonic offsets starting at 0.",
        code: `class EventLog:
    def __init__(self) -> None:
        self._events: list[str] = []

    def append(self, event: str) -> int:
        offset = len(self._events)
        self._events.append(event)
        return offset
`,
      },
      {
        id: "replay",
        requirement: "Stage 2: replay(from_offset) yields events from that offset onward.",
        code: `class EventLog:
    def __init__(self) -> None:
        self._events: list[str] = []

    def append(self, event: str) -> int:
        offset = len(self._events)
        self._events.append(event)
        return offset

    def replay(self, from_offset: int) -> list[str]:
        if from_offset < 0 or from_offset > len(self._events):
            raise ValueError("invalid offset")
        return self._events[from_offset:]
`,
      },
      {
        id: "compact",
        requirement: "Stage 3: compact(before_offset) drops events before the cutoff.",
        code: `class EventLog:
    def __init__(self) -> None:
        self._events: list[str] = []

    def append(self, event: str) -> int:
        offset = len(self._events)
        self._events.append(event)
        return offset

    def replay(self, from_offset: int) -> list[str]:
        if from_offset < 0 or from_offset > len(self._events):
            raise ValueError("invalid offset")
        return self._events[from_offset:]

    def compact(self, before_offset: int) -> None:
        if before_offset < 0:
            raise ValueError("invalid offset")
        self._events = self._events[before_offset:]
`,
      },
    ],
  }),

  stagedSnippet({
    id: "anthropic-counter-service",
    title: "Windowed Counter Service",
    pattern: "hash-map",
    difficulty: "easy",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 2,
    motifs: ["counter-defaultdict", "hash-lookup"],
    packIds: ["company-anthropic"],
    tracks: ["anthropic"],
    levelRange: ["junior"],
    sourceStyle: "Anthropic L3 counter with keyed increments.",
    description: "Simple counter service escalating to windowed reset.",
    stages: [
      {
        id: "basic",
        requirement: "Stage 1: increment(key) and get(key) with default 0.",
        code: `class CounterService:
    def __init__(self) -> None:
        self._counts: dict[str, int] = {}

    def increment(self, key: str, delta: int = 1) -> int:
        self._counts[key] = self._counts.get(key, 0) + delta
        return self._counts[key]

    def get(self, key: str) -> int:
        return self._counts.get(key, 0)
`,
      },
      {
        id: "reset-window",
        requirement: "Stage 2: reset_all() clears every counter for a new window.",
        code: `class CounterService:
    def __init__(self) -> None:
        self._counts: dict[str, int] = {}

    def increment(self, key: str, delta: int = 1) -> int:
        self._counts[key] = self._counts.get(key, 0) + delta
        return self._counts[key]

    def get(self, key: str) -> int:
        return self._counts.get(key, 0)

    def reset_all(self) -> None:
        self._counts.clear()
`,
      },
    ],
  }),

  stagedSnippet({
    id: "anthropic-bounded-queue",
    title: "Thread-Safe Bounded Queue",
    pattern: "stack",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["deque-window"],
    packIds: ["company-anthropic"],
    tracks: ["anthropic"],
    levelRange: ["senior"],
    sourceStyle: "Anthropic L5 concurrency — lock, condition, backpressure.",
    description: "Bounded queue escalating to thread-safe put/get with timeout.",
    stages: [
      {
        id: "single-thread",
        requirement: "Stage 1: put(item) blocks when full; get() blocks when empty.",
        code: `from collections import deque

class BoundedQueue:
    def __init__(self, capacity: int) -> None:
        if capacity < 1:
            raise ValueError("capacity must be positive")
        self._capacity = capacity
        self._items: deque[str] = deque()

    def put(self, item: str) -> None:
        while len(self._items) >= self._capacity:
            pass
        self._items.append(item)

    def get(self) -> str:
        while not self._items:
            pass
        return self._items.popleft()
`,
      },
      {
        id: "locked",
        requirement: "Stage 2: Protect put/get with threading.Lock.",
        code: `from collections import deque
import threading

class BoundedQueue:
    def __init__(self, capacity: int) -> None:
        if capacity < 1:
            raise ValueError("capacity must be positive")
        self._capacity = capacity
        self._items: deque[str] = deque()
        self._lock = threading.Lock()

    def put(self, item: str) -> None:
        with self._lock:
            while len(self._items) >= self._capacity:
                pass
            self._items.append(item)

    def get(self) -> str:
        with self._lock:
            while not self._items:
                pass
            return self._items.popleft()
`,
      },
      {
        id: "condition",
        requirement: "Stage 3: Use Condition for backpressure; get(timeout) returns None on timeout.",
        code: `from collections import deque
import threading

class BoundedQueue:
    def __init__(self, capacity: int) -> None:
        if capacity < 1:
            raise ValueError("capacity must be positive")
        self._capacity = capacity
        self._items: deque[str] = deque()
        self._cond = threading.Condition()

    def put(self, item: str) -> None:
        with self._cond:
            while len(self._items) >= self._capacity:
                self._cond.wait()
            self._items.append(item)
            self._cond.notify()

    def get(self, timeout: float | None = None) -> str | None:
        with self._cond:
            if not self._items:
                if not self._cond.wait(timeout):
                    return None
            if not self._items:
                return None
            value = self._items.popleft()
            self._cond.notify()
            return value
`,
      },
    ],
  }),
];
