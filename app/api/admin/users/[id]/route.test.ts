import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetCurrentUser = vi.fn();
const mockFindUnique = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/auth", () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

import { PATCH } from "./route";

function req(body: unknown) {
  return { json: async () => body } as any;
}

const admin = { id: "admin_1", role: "ADMIN" };
const targetRep = { id: "rep_1", role: "REP", status: "PENDING" };

describe("PATCH /api/admin/users/[id] - secure admin controls", () => {
  beforeEach(() => {
    mockGetCurrentUser.mockReset();
    mockFindUnique.mockReset();
    mockUpdate.mockReset();
  });

  it("returns 401 when there is no authenticated user", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const res = await PATCH(req({ status: "ACTIVE" }), { params: { id: "rep_1" } });
    expect(res.status).toBe(401);
  });

  it("returns 403 for a non-admin caller (e.g. a rep or manager)", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "rep_1", role: "REP" });
    const res = await PATCH(req({ status: "ACTIVE" }), { params: { id: "rep_2" } });
    expect(res.status).toBe(403);
  });

  it("approves a pending user (PENDING -> ACTIVE)", async () => {
    mockGetCurrentUser.mockResolvedValue(admin);
    mockFindUnique.mockResolvedValue(targetRep);
    mockUpdate.mockResolvedValue({ ...targetRep, status: "ACTIVE" });
    const res = await PATCH(req({ status: "ACTIVE" }), { params: { id: "rep_1" } });
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "rep_1" }, data: expect.objectContaining({ status: "ACTIVE" }) })
    );
  });

  it("grants a role change (REP -> MANAGER)", async () => {
    mockGetCurrentUser.mockResolvedValue(admin);
    mockFindUnique.mockResolvedValue({ ...targetRep, status: "ACTIVE" });
    mockUpdate.mockResolvedValue({ ...targetRep, role: "MANAGER" });
    const res = await PATCH(req({ role: "MANAGER" }), { params: { id: "rep_1" } });
    expect(res.status).toBe(200);
  });

  it("rejects an invalid role or status value", async () => {
    mockGetCurrentUser.mockResolvedValue(admin);
    const res = await PATCH(req({ role: "SUPERUSER" }), { params: { id: "rep_1" } });
    expect(res.status).toBe(400);
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("returns 404 for a target user that does not exist", async () => {
    mockGetCurrentUser.mockResolvedValue(admin);
    mockFindUnique.mockResolvedValue(null);
    const res = await PATCH(req({ status: "SUSPENDED" }), { params: { id: "ghost" } });
    expect(res.status).toBe(404);
  });

  it("prevents an admin from suspending their own account (self-lockout guard)", async () => {
    mockGetCurrentUser.mockResolvedValue(admin);
    mockFindUnique.mockResolvedValue({ ...admin, status: "ACTIVE" });
    const res = await PATCH(req({ status: "SUSPENDED" }), { params: { id: admin.id } });
    expect(res.status).toBe(400);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("prevents an admin from demoting their own role away from ADMIN (self-lockout guard)", async () => {
    mockGetCurrentUser.mockResolvedValue(admin);
    mockFindUnique.mockResolvedValue({ ...admin, status: "ACTIVE" });
    const res = await PATCH(req({ role: "REP" }), { params: { id: admin.id } });
    expect(res.status).toBe(400);
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
