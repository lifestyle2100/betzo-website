import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";

const router = Router();

router.post("/auth/register", async (req, res) => {
  try {
    const { username, email, phone, password, country } = req.body as {
      username: string;
      email: string;
      phone?: string;
      password: string;
      country?: string;
    };

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email and password are required" });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(or(eq(usersTable.email, email), eq(usersTable.username, username)))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email or username already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(usersTable)
      .values({
        username,
        email,
        phone: phone || null,
        passwordHash,
        country: country || "Bangladesh",
      })
      .returning({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        balance: usersTable.balance,
        currency: usersTable.currency,
        country: usersTable.country,
        createdAt: usersTable.createdAt,
      });

    (req.session as any).userId = user.id;
    (req.session as any).username = user.username;

    return res.status(201).json({ user });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body as {
      emailOrUsername: string;
      password: string;
    };

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: "Email/username and password are required" });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        or(
          eq(usersTable.email, emailOrUsername),
          eq(usersTable.username, emailOrUsername)
        )
      )
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    (req.session as any).userId = user.id;
    (req.session as any).username = user.username;

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        currency: user.currency,
        country: user.country,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("xbetzone.sid");
    return res.json({ success: true });
  });
});

router.get("/auth/me", async (req, res) => {
  const session = req.session as any;
  if (!session?.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        balance: usersTable.balance,
        currency: usersTable.currency,
        country: usersTable.country,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, session.userId))
      .limit(1);

    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Session expired" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Auth me error:", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
