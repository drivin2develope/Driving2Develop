import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindUnique = vi.fn();
const mockCount = vi.fn();
const mockCreate = vi.fn();
const mockHashPassword = vi.fn();
const mockSignSession = vi.fn();
const mockSetSessionCookie = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      count: (...args: unknown[]) => mockCount(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  hashPassword: (...args: unknown[]) => mockHashPassword(...args),
  signSession: (...args: unknown[]) => mockSignSession(...args),
  setSessionCookie: (...args: unknown[]) => mockSetSessionCookie(...args),
}));

import { POST } from "./route";

function req(body: unknown) {
  return { json: async () => body } as any;
}

describe("POST /api/auth/signup - approval-gated onboarding", () => {
  beforeEach(() => {
    mockFindUnique.mockReset().mockResolvedValue(null);
    mockCount.mockReset();
    mockCreate.mockReset();
    mockHashPassword.mockReset().mockResolvedValue("hashed");
    mockSignSession.mockReset().mockResolvedValue("token");
    mockSetSessionCookie.mockReset();
  });

  it("bootstraps the very first account on a fresh install as an active admin", async () => {
    mockCount.mockResolvedValue(0);
    mockCreate.mockResolvedValue({ id: "u1", email: "owner@x.com", name: "Owner", role: "ADMIN", status: "ACTIVE" });

    const res = await POST(req({ email: "owner@x.com", password: "password123", name: "Owner" }));
    const data = await res.json();

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ role: "ADMIN", status: "ACTIVE" }) })
    );
    expect(mockSetSessionCookie).toHaveBeenCalled();
    expect(data.role).toBe("ADMIN");
  });

  it("puts every subsequent signup into PENDING and does not issue a session", async () => {
    mockCount.mockResolvedValue(1);
    mockCreate.mockResolvedValue({ id: "u2", email: "second@x.com", name: "Second", role: "REP", status: "PENDING" });

    const res = await POST(req({ email: "second@x.com", password: "password123", name: "Second" }));
    const data = await res.json();

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ role: "REP", status: "PENDING" }) })
    );
    expect(mockSetSessionCookie).not.toHaveBeenCalled();
    expect(data.pending).toBe(true);
  });

  it("rejects signup with an email that already exists", async () => {
    mockFindUnique.mockResolvedValue({ id: "existing" });
    const res = await POST(req({ email: "taken@x.com", password: "password123", name: "Someone" }));
    expect(res.status).toBe(409);
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
