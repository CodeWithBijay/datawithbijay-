// Makes the three admin-login values for Vercel. Your password is typed hidden and never saved anywhere:
// only a one-way hash of it is printed.
//   node scripts/admin-password.mjs
import { scryptSync, randomBytes } from "crypto";
import readline from "readline";

function ask(q, hidden) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = (s) => { if (s.includes(q)) rl.output.write(q); else rl.output.write("*".repeat(s.length ? 1 : 0)); };
    rl.question(q, (a) => { rl.close(); if (hidden) process.stdout.write("\n"); resolve(a); });
  });
}

const user = (await ask("Admin ID (username): ")).trim();
const pw = await ask("Password (hidden, 12+ characters): ", true);
const pw2 = await ask("Type it again: ", true);
if (!user) { console.error("✗ The ID can't be empty."); process.exit(1); }
if (pw !== pw2) { console.error("✗ The two passwords don't match. Run it again."); process.exit(1); }
if (pw.length < 12) { console.error("✗ Use at least 12 characters (a short sentence works well)."); process.exit(1); }

const N = 16384, r = 8, p = 1, salt = randomBytes(16);
const hash = scryptSync(pw, salt, 64, { N, r, p });
console.log("\nAdd these three in Vercel → Settings → Environment Variables (type: Secret), then redeploy:\n");
console.log("ADMIN_USERNAME=" + user);
console.log("ADMIN_PASSWORD_HASH=" + ["scrypt", N, r, p, salt.toString("base64"), hash.toString("base64")].join(":"));
console.log("ADMIN_SESSION_SECRET=" + randomBytes(32).toString("hex"));
console.log("\nThe password itself is not in these values. Keep it in your password manager.");
