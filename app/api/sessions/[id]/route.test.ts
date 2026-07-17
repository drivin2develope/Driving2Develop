import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetCurrentUser = vi.fn();
const mockFindUnique = vi.fn();

vi.mock("@/lib/auth", () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    practiceSession: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

import { GET } from "./route";

const OWNER_ID = "user_owner";
const OTHER_REP_ID = "user_other_rep";
const MANAGER_ID = "user_manager";
const OTHER_MANAGER_ID = "user_other_manager";

const baseSession = {
  id: "session_1",
  userId: OWNER_ID,
  user: { id: OWNER_ID, managerId: MANAGER_ID },
};

function call() {
  return GET({} as any, { params: { id: "session_1" } });
}

describe("GET /api/sessions/[id] - tenant isolation", () => {
  beforeEach(() => {
    mockGetCurrentUser.mockReset();
    mockFindUnique.mockReset();
  });

  it("returns 401 when there is no authenticated user", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const res = await call();
    expect(res.status).toBe(401);
  });

  it("returns 404 when the session does not exist", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: OWNER_ID, role: "REP" });
    mockFindUnique.mockResolvedValue(null);
    const res = await call();
    expect(res.status).toBe(404);
  });

  it("allows the session's own owner to view it", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: OWNER_ID, role: "REP" });
    mockFindUnique.mockResolvedValue(baseSession);
    const res = await call();
    expect(res.status).toBe(200);
  });

  it("allows the owner's direct manager to view it", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: MANAGER_ID, role: "MANAGER" });
    mockFindUnique.mockResolvedValue(baseSession);
    const res = await call();
    expect(res.status).toBe(200);
  });

  it("denies a different rep who does not own the session", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: OTHER_REP_ID, role: "REP" });
    mockFindUnique.mockResolvedValue(baseSession);
    const res = await call();
    expect(res.status).toBe(403);
  });

  it("denies a manager who is not this specific rep's manager (cross-tenant isolation)", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: OTHER_MANAGER_ID, role: "MANAGER" });
    mockFindUnique.mockResolvedValue(baseSession);
    const res = await call();
    expect(res.status).toBe(403);
  });
});
