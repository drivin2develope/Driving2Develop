import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetCurrentUser = vi.fn();
const mockUpdate = vi.fn();
const mockSignSession = vi.fn();
const mockSetSessionCookie = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: { user: { update: (...args: unknown[]) => mockUpdate(...args) } },
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUser: () => mockGetCurrentUser(),
  signSession: (...args: unknown[]) => mockSignSession(...args),
  setSessionCookie: (...args: unknown[]) => mockSetSessionCookie(...args),
}));

import { PATCH } from "./route";

function req(body: unknown) {
  return { json: async () => body } as any;
}

describe("PATCH /api/settings - role self-service is capped at REP/MANAGER", () => {
  beforeEach(() => {
    mockGetCurrentUser.mockReset();
    mockUpdate.mockReset();
    mockSignSession.mockReset().mockResolvedValue("token");
    mockSetSessionCookie.mockReset();
  });

  it("silently ignores an attempt to self-promote to ADMIN through profile settings", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "u1", role: "REP", passwordHash: "x" });
    mockUpdate.mockResolvedValue({ id: "u1", role: "REP", passwordHash: "x", name: "Someone" });

    await PATCH(req({ name: "Someone", role: "ADMIN" }));

    // The role field must never reach the database update call.
    const dataArg = mockUpdate.mock.calls[0][0].data;
    expect(dataArg.role).toBeUndefined();
  });

  it("still allows the legitimate REP <-> MANAGER self-service toggle", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "u1", role: "REP", passwordHash: "x" });
    mockUpdate.mockResolvedValue({ id: "u1", role: "MANAGER", passwordHash: "x", name: "Someone" });

    await PATCH(req({ role: "MANAGER" }));

    const dataArg = mockUpdate.mock.calls[0][0].data;
    expect(dataArg.role).toBe("MANAGER");
  });
});
