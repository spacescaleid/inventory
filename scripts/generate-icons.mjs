import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const iconsDir = join(rootDir, "public", "icons");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
  }

  const svgPath = join(iconsDir, "icon-source.svg");
  if (!existsSync(svgPath)) {
    console.error("❌ icon-source.svg tidak ditemukan!");
    console.error(`   Expected: ${svgPath}`);
    process.exit(1);
  }

  const svgBuffer = readFileSync(svgPath);

  console.log("🎨 Generating icons...\n");

  for (const size of sizes) {
    const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ ${size}x${size}`);
  }

  // Generate favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(rootDir, "public", "favicon.png"));
  console.log(`✓ favicon.png (32x32)`);

  // Generate apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(rootDir, "public", "apple-touch-icon.png"));
  console.log(`✓ apple-touch-icon.png (180x180)`);

  // Generate shortcut icons
  await sharp(svgBuffer)
    .resize(96, 96)
    .png()
    .toFile(join(iconsDir, "shortcut-catat.png"));
  console.log(`✓ shortcut-catat.png`);

  await sharp(svgBuffer)
    .resize(96, 96)
    .png()
    .toFile(join(iconsDir, "shortcut-stok.png"));
  console.log(`✓ shortcut-stok.png`);

  console.log("\n✅ Semua icon berhasil dibuat!");
}

generateIcons().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});