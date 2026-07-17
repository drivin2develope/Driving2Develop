import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindUnique = vi.fn();
const mockVerifyPassword = vi.fn();
const mockSignSession = vi.fn();
const mockSetSessionCookie = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: { user: { findUnique: (...args: unknown[]) => mockFindUnique(...args) } },
}));

vi.mock("@/lib/auth", () => ({
  verifyPassword: (...args: unknown[]) => mockVerifyPassword(...args),
  signSession: (...args: unknown[]) => mockSignSession(...args),
  setSessionCookie: (...args: unknown[]) => mockSetSessionCookie(...args),
}));

import { POST } from "./route";

function req(body: unknown) {
  return { json: async () => body } as any;
}

const baseUser = {
  id: "user_1",
  email: "rep1@driven2develop.dev",
  name: "Rep One",
  role: "REP",
  passwordHash: "hash",
};

describe("POST /api/auth/login - account status gating", () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
    mockVerifyPassword.mockReset();
    mockSignSession.mockReset().mockResolvedValue("token");
    mockSetSessionCookie.mockReset();
  });

  it("rejects a PENDING (not-yet-approved) account even with correct credentials", async () => {
    mockFindUnique.mockResolvedValue({ ...baseUser, status: "PENDING" });
    mockVerifyPassword.mockResolvedValue(true);
    const res = await POST(req({ email: baseUser.email, password: "password123" }));
    expect(res.status).toBe(403);
    expect(mockSetSessionCookie).not.toHaveBeenCalled();
  });

  it("rejects a SUSPENDED account even with correct credentials", async () => {
    mockFindUnique.mockResolvedValue({ ...baseUser, status: "SUSPENDED" });
    mockVerifyPassword.mockResolvedValue(true);
    const res = await POST(req({ email: baseUser.email, password: "password123" }));
    expect(res.status).toBe(403);
    expect(mockSetSessionCookie).not.toHaveBeenCalled();
  });

  it("logs in an ACTIVE account with correct credentials", async () => {
    mockFindUnique.mockResolvedValue({ ...baseUser, status: "ACTIVE" });
    mockVerifyPassword.mockResolvedValue(true);
    const res = await POST(req({ email: baseUser.email, password: "password123" }));
    expect(res.status).toBe(200);
    expect(mockSetSessionCookie).toHaveBeenCalledWith("token");
  });

  it("rejects wrong credentials regardless of status", async () => {
    mockFindUnique.mockResolvedValue({ ...baseUser, status: "ACTIVE" });
    mockVerifyPassword.mockResolvedValue(false);
    const res = await POST(req({ email: baseUser.email, password: "wrong" }));
    expect(res.status).toBe(401);
  });
});
