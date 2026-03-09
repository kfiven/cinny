const fs = require("fs");
const path = require("path");

const version = process.argv[2];

if (!version) {
  console.error("Version argument missing");
  process.exit(1);
}

const newVersion = `v${version}`;

const files = [
  "src/app/features/settings/about/About.tsx",
  "src/app/pages/auth/AuthFooter.tsx",
  "src/app/pages/client/WelcomePage.tsx",
];

files.forEach((filePath) => {
  const absPath = path.resolve(filePath);

  if (!fs.existsSync(absPath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(absPath, "utf8");

  const updated = content.replace(/v\d+\.\d+\.\d+/g, newVersion);

  fs.writeFileSync(absPath, updated);

  console.log(`Updated ${filePath} → ${newVersion}`);
});