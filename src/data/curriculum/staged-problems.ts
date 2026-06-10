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

  stagedSnippet({
    id: "openai-retry-queue",
    title: "Retry Queue with Dead Letter",
    pattern: "stack",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["deque-window"],
    packIds: ["company-openai"],
    tracks: ["openai"],
    levelRange: ["mid"],
    sourceStyle: "OpenAI gate-style delivery queue with backoff and DLQ.",
    description: "Message queue with exponential backoff and dead-letter routing.",
    stages: [
      {
        id: "enqueue",
        requirement: "Gate 1: enqueue(task_id) stores pending work in FIFO order.",
        code: `from collections import deque

class RetryQueue:
    def __init__(self) -> None:
        self._pending: deque[str] = deque()

    def enqueue(self, task_id: str) -> None:
        self._pending.append(task_id)

    def pending_count(self) -> int:
        return len(self._pending)
`,
      },
      {
        id: "backoff",
        requirement: "Gate 2: record_failure(id) tracks attempt count per task.",
        code: `from collections import deque

class RetryQueue:
    def __init__(self, max_attempts: int = 3) -> None:
        self._pending: deque[str] = deque()
        self._attempts: dict[str, int] = {}
        self._max_attempts = max_attempts

    def enqueue(self, task_id: str) -> None:
        self._pending.append(task_id)
        self._attempts.setdefault(task_id, 0)

    def record_failure(self, task_id: str) -> int:
        self._attempts[task_id] = self._attempts.get(task_id, 0) + 1
        delay = 2 ** (self._attempts[task_id] - 1)
        if self._attempts[task_id] < self._max_attempts:
            self._pending.append(task_id)
        return delay
`,
      },
      {
        id: "dlq",
        requirement: "Gate 3: Tasks exceeding max attempts move to dead_letter().",
        code: `from collections import deque

class RetryQueue:
    def __init__(self, max_attempts: int = 3) -> None:
        self._pending: deque[str] = deque()
        self._dead: list[str] = []
        self._attempts: dict[str, int] = {}
        self._max_attempts = max_attempts

    def enqueue(self, task_id: str) -> None:
        self._pending.append(task_id)
        self._attempts.setdefault(task_id, 0)

    def record_failure(self, task_id: str) -> int:
        self._attempts[task_id] = self._attempts.get(task_id, 0) + 1
        delay = 2 ** (self._attempts[task_id] - 1)
        if self._attempts[task_id] >= self._max_attempts:
            self._dead.append(task_id)
        else:
            self._pending.append(task_id)
        return delay

    def dead_letter(self) -> list[str]:
        return list(self._dead)
`,
      },
    ],
  }),

  stagedSnippet({
    id: "openai-ip-iterator",
    title: "IP Address Iterator",
    pattern: "arrays",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["enumerate-index"],
    packIds: ["company-openai"],
    tracks: ["openai"],
    levelRange: ["mid"],
    sourceStyle: "OpenAI CIDR parse and lazy host iteration gates.",
    description: "Expand CIDR blocks and iterate hosts lazily.",
    stages: [
      {
        id: "parse",
        requirement: "Gate 1: parse_cidr(cidr) returns (start_ip, host_count) as integers.",
        code: `def parse_cidr(cidr: str) -> tuple[int, int]:
    ip_part, prefix = cidr.split("/")
    prefix_len = int(prefix)
    octets = [int(x) for x in ip_part.split(".")]
    start = (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3]
    host_bits = 32 - prefix_len
    host_count = 1 << host_bits
    network = start & (~((1 << host_bits) - 1) if host_bits else 0)
    return network, host_count
`,
      },
      {
        id: "lazy",
        requirement: "Gate 2: IpIterator yields dotted-quad strings without storing the full range.",
        code: `def parse_cidr(cidr: str) -> tuple[int, int]:
    ip_part, prefix = cidr.split("/")
    prefix_len = int(prefix)
    octets = [int(x) for x in ip_part.split(".")]
    start = (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3]
    host_bits = 32 - prefix_len
    host_count = 1 << host_bits
    network = start & (~((1 << host_bits) - 1) if host_bits else 0)
    return network, host_count

def _format_ip(value: int) -> str:
    return ".".join(str((value >> shift) & 255) for shift in (24, 16, 8, 0))

class IpIterator:
    def __init__(self, cidr: str) -> None:
        self._start, self._count = parse_cidr(cidr)
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self) -> str:
        if self._index >= self._count:
            raise StopIteration
        ip = self._start + self._index
        self._index += 1
        return _format_ip(ip)
`,
      },
    ],
  }),

  stagedSnippet({
    id: "openai-versioned-kv",
    title: "Versioned Key-Value Store",
    pattern: "hash-map",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["hash-lookup"],
    packIds: ["company-openai"],
    tracks: ["openai"],
    levelRange: ["senior"],
    sourceStyle: "OpenAI versioned KV with point-in-time read and rollback.",
    description: "KV store with monotonic versions and rollback.",
    stages: [
      {
        id: "versioned-set",
        requirement: "Gate 1: set(key, value) returns a new global version number.",
        code: `class VersionedKV:
    def __init__(self) -> None:
        self._version = 0
        self._history: list[dict[str, str]] = [{}]

    def set(self, key: str, value: str) -> int:
        self._version += 1
        snapshot = dict(self._history[-1])
        snapshot[key] = value
        self._history.append(snapshot)
        return self._version
`,
      },
      {
        id: "get-at",
        requirement: "Gate 2: get(key, version) reads the snapshot at that version.",
        code: `class VersionedKV:
    def __init__(self) -> None:
        self._version = 0
        self._history: list[dict[str, str]] = [{}]

    def set(self, key: str, value: str) -> int:
        self._version += 1
        snapshot = dict(self._history[-1])
        snapshot[key] = value
        self._history.append(snapshot)
        return self._version

    def get(self, key: str, version: int) -> str | None:
        if version < 0 or version >= len(self._history):
            raise ValueError("invalid version")
        return self._history[version].get(key)
`,
      },
      {
        id: "rollback",
        requirement: "Gate 3: rollback(version) truncates history to that snapshot.",
        code: `class VersionedKV:
    def __init__(self) -> None:
        self._version = 0
        self._history: list[dict[str, str]] = [{}]

    def set(self, key: str, value: str) -> int:
        self._version += 1
        snapshot = dict(self._history[-1])
        snapshot[key] = value
        self._history.append(snapshot)
        return self._version

    def get(self, key: str, version: int) -> str | None:
        if version < 0 or version >= len(self._history):
            raise ValueError("invalid version")
        return self._history[version].get(key)

    def rollback(self, version: int) -> None:
        if version < 0 or version >= len(self._history):
            raise ValueError("invalid version")
        self._history = self._history[: version + 1]
        self._version = version
`,
      },
    ],
  }),

  stagedSnippet({
    id: "anthropic-concurrent-crawler",
    title: "Concurrent Web Crawler",
    pattern: "graphs",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["graph-adjacency", "bfs-queue"],
    packIds: ["company-anthropic"],
    tracks: ["anthropic"],
    levelRange: ["senior"],
    sourceStyle: "Anthropic L5 threaded crawler — fetch, politeness, dedup.",
    description: "Multi-threaded crawler with rate limiting and visited-set deduplication.",
    stages: [
      {
        id: "fetch-parse",
        requirement: "Stage 1: fetch(url) returns HTML; parse_links extracts absolute hrefs.",
        code: `import re
from urllib.parse import urljoin

class Crawler:
    _HREF = re.compile(r'href=["\\']([^"\\']+)["\\']')

    def fetch(self, url: str) -> str:
        raise NotImplementedError("network stub")

    def parse_links(self, html: str, base: str) -> list[str]:
        links: list[str] = []
        for match in self._HREF.finditer(html):
            href = match.group(1).split("#", 1)[0]
            if href and not href.startswith(("mailto:", "javascript:")):
                links.append(urljoin(base, href))
        return links
`,
      },
      {
        id: "politeness",
        requirement: "Stage 2: wait_turn() enforces min delay between fetches with a Lock.",
        code: `import re
import threading
import time
from urllib.parse import urljoin

class Crawler:
    _HREF = re.compile(r'href=["\\']([^"\\']+)["\\']')

    def __init__(self, min_delay_sec: float = 0.5) -> None:
        self._min_delay = min_delay_sec
        self._lock = threading.Lock()
        self._last_fetch = 0.0

    def fetch(self, url: str) -> str:
        raise NotImplementedError("network stub")

    def parse_links(self, html: str, base: str) -> list[str]:
        links: list[str] = []
        for match in self._HREF.finditer(html):
            href = match.group(1).split("#", 1)[0]
            if href and not href.startswith(("mailto:", "javascript:")):
                links.append(urljoin(base, href))
        return links

    def wait_turn(self) -> None:
        with self._lock:
            now = time.monotonic()
            wait = self._min_delay - (now - self._last_fetch)
            if wait > 0:
                time.sleep(wait)
            self._last_fetch = time.monotonic()
`,
      },
      {
        id: "visited-dedup",
        requirement: "Stage 3: crawl(seed) returns pages fetched once using a thread-safe visited set.",
        code: `import re
import threading
import time
from collections import deque
from urllib.parse import urljoin

class Crawler:
    _HREF = re.compile(r'href=["\\']([^"\\']+)["\\']')

    def __init__(self, min_delay_sec: float = 0.5) -> None:
        self._min_delay = min_delay_sec
        self._lock = threading.Lock()
        self._last_fetch = 0.0
        self._visited: set[str] = set()
        self._visited_lock = threading.Lock()

    def fetch(self, url: str) -> str:
        raise NotImplementedError("network stub")

    def parse_links(self, html: str, base: str) -> list[str]:
        links: list[str] = []
        for match in self._HREF.finditer(html):
            href = match.group(1).split("#", 1)[0]
            if href and not href.startswith(("mailto:", "javascript:")):
                links.append(urljoin(base, href))
        return links

    def wait_turn(self) -> None:
        with self._lock:
            now = time.monotonic()
            wait = self._min_delay - (now - self._last_fetch)
            if wait > 0:
                time.sleep(wait)
            self._last_fetch = time.monotonic()

    def _mark_visited(self, url: str) -> bool:
        with self._visited_lock:
            if url in self._visited:
                return False
            self._visited.add(url)
            return True

    def crawl(self, seed: str, max_pages: int = 50) -> list[str]:
        queue: deque[str] = deque([seed])
        fetched: list[str] = []
        while queue and len(fetched) < max_pages:
            url = queue.popleft()
            if not self._mark_visited(url):
                continue
            self.wait_turn()
            html = self.fetch(url)
            fetched.append(url)
            for link in self.parse_links(html, url):
                queue.append(link)
        return fetched
`,
      },
    ],
  }),

  stagedSnippet({
    id: "anthropic-producer-consumer",
    title: "Producer-Consumer Buffer",
    pattern: "stack",
    difficulty: "hard",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 4,
    motifs: ["deque-window"],
    packIds: ["company-anthropic"],
    tracks: ["anthropic"],
    levelRange: ["senior"],
    sourceStyle: "Anthropic L5 sync buffer then asyncio.Queue.",
    description: "Bounded buffer with threading, then async queue variant.",
    stages: [
      {
        id: "sync",
        requirement: "Stage 1: BoundedBuffer uses Lock/Condition for blocking put and get.",
        code: `from collections import deque
import threading

class BoundedBuffer:
    def __init__(self, capacity: int) -> None:
        self._cap = capacity
        self._items: deque[str] = deque()
        self._cond = threading.Condition()

    def put(self, item: str) -> None:
        with self._cond:
            while len(self._items) >= self._cap:
                self._cond.wait()
            self._items.append(item)
            self._cond.notify()

    def get(self) -> str:
        with self._cond:
            while not self._items:
                self._cond.wait()
            item = self._items.popleft()
            self._cond.notify()
            return item
`,
      },
      {
        id: "async",
        requirement: "Stage 2: AsyncBoundedBuffer wraps asyncio.Queue with the same put/get API.",
        code: `import asyncio

class AsyncBoundedBuffer:
    def __init__(self, capacity: int) -> None:
        self._queue: asyncio.Queue[str] = asyncio.Queue(maxsize=capacity)

    async def put(self, item: str) -> None:
        await self._queue.put(item)

    async def get(self) -> str:
        return await self._queue.get()
`,
      },
    ],
  }),

  stagedSnippet({
    id: "anthropic-dag-scheduler",
    title: "Job DAG Scheduler",
    pattern: "graphs",
    difficulty: "medium",
    language: "python",
    tier: "interview-fluency",
    fluencyLevel: 3,
    motifs: ["graph-adjacency"],
    packIds: ["company-anthropic"],
    tracks: ["anthropic"],
    levelRange: ["mid"],
    sourceStyle: "Anthropic L4 DAG run → topo order → cycle detect.",
    description: "Schedule jobs with dependencies; detect cycles before execution.",
    stages: [
      {
        id: "run-single",
        requirement: "Stage 1: run(job_id) records completion in finished set.",
        code: `class JobScheduler:
    def __init__(self) -> None:
        self._finished: set[str] = set()

    def run(self, job_id: str) -> None:
        self._finished.add(job_id)

    def is_done(self, job_id: str) -> bool:
        return job_id in self._finished
`,
      },
      {
        id: "topo-run",
        requirement: "Stage 2: run_all(deps) executes jobs respecting dependency edges.",
        code: `from collections import deque

class JobScheduler:
    def __init__(self) -> None:
        self._finished: set[str] = set()

    def run(self, job_id: str) -> None:
        self._finished.add(job_id)

    def is_done(self, job_id: str) -> bool:
        return job_id in self._finished

    def run_all(self, jobs: list[str], deps: list[tuple[str, str]]) -> list[str]:
        indeg: dict[str, int] = {j: 0 for j in jobs}
        adj: dict[str, list[str]] = {j: [] for j in jobs}
        for before, after in deps:
            adj[before].append(after)
            indeg[after] += 1
        q = deque(j for j in jobs if indeg[j] == 0)
        order: list[str] = []
        while q:
            job = q.popleft()
            self.run(job)
            order.append(job)
            for nxt in adj[job]:
                indeg[nxt] -= 1
                if indeg[nxt] == 0:
                    q.append(nxt)
        return order
`,
      },
      {
        id: "cycle-detect",
        requirement: "Stage 3: has_cycle(deps) returns True when dependencies form a loop.",
        code: `from collections import deque

class JobScheduler:
    def __init__(self) -> None:
        self._finished: set[str] = set()

    def run(self, job_id: str) -> None:
        self._finished.add(job_id)

    def is_done(self, job_id: str) -> bool:
        return job_id in self._finished

    def run_all(self, jobs: list[str], deps: list[tuple[str, str]]) -> list[str]:
        indeg: dict[str, int] = {j: 0 for j in jobs}
        adj: dict[str, list[str]] = {j: [] for j in jobs}
        for before, after in deps:
            adj[before].append(after)
            indeg[after] += 1
        q = deque(j for j in jobs if indeg[j] == 0)
        order: list[str] = []
        while q:
            job = q.popleft()
            self.run(job)
            order.append(job)
            for nxt in adj[job]:
                indeg[nxt] -= 1
                if indeg[nxt] == 0:
                    q.append(nxt)
        return order

    def has_cycle(self, jobs: list[str], deps: list[tuple[str, str]]) -> bool:
        indeg: dict[str, int] = {j: 0 for j in jobs}
        adj: dict[str, list[str]] = {j: [] for j in jobs}
        for before, after in deps:
            adj[before].append(after)
            indeg[after] += 1
        q = deque(j for j in jobs if indeg[j] == 0)
        seen = 0
        while q:
            job = q.popleft()
            seen += 1
            for nxt in adj[job]:
                indeg[nxt] -= 1
                if indeg[nxt] == 0:
                    q.append(nxt)
        return seen != len(jobs)
`,
      },
    ],
  }),
];
