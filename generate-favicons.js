import sharp from 'sharp';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置：原始图片路径和输出目录
const inputImage = process.argv[2];
const outputDir = join(__dirname, 'public');
const faviconsDir = join(outputDir, 'favicons');

if (!inputImage) {
  console.error('❌ 请提供图片文件路径');
  console.log('用法: node generate-favicons.js <图片路径>');
  console.log('示例: node generate-favicons.js ./my-logo.png');
  process.exit(1);
}

// 确保输出目录存在
if (!existsSync(faviconsDir)) {
  mkdirSync(faviconsDir, { recursive: true });
}

// 需要生成的尺寸配置
const faviconConfigs = [
  { name: 'favicons/favicon-16x16.png', width: 16, height: 16 },
  { name: 'favicons/favicon-32x32.png', width: 32, height: 32 },
  { name: 'favicons/apple-touch-icon.png', width: 180, height: 180 },
  { name: 'favicons/android-chrome-192x192.png', width: 192, height: 192 },
  { name: 'favicons/android-chrome-512x512.png', width: 512, height: 512 },
];

async function generateFavicons() {
  try {
    if (!existsSync(inputImage)) {
      console.error(`❌ 文件不存在: ${inputImage}`);
      process.exit(1);
    }

    console.log(`📸 正在处理图片: ${inputImage}`);
    
    // 读取原始图片
    const image = sharp(inputImage);
    const metadata = await image.metadata();
    console.log(`   原始尺寸: ${metadata.width}x${metadata.height}, 格式: ${metadata.format}`);

    // 处理 SVG
    if (inputImage.endsWith('.svg')) {
      const svgPath = join(outputDir, 'favicon.svg');
      copyFileSync(inputImage, svgPath);
      console.log(`✓ 已生成: favicon.svg`);
    } else {
      // 如果不是 SVG，生成一个 SVG（使用 PNG 作为 base64）
      console.log(`⚠ 原图不是 SVG，将生成 PNG 格式的 favicon.svg`);
    }

    // 生成各种尺寸的 PNG
    for (const config of faviconConfigs) {
      const outputPath = join(outputDir, config.name);
      
      await image
        .clone()
        .resize(config.width, config.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ 已生成: ${config.name} (${config.width}x${config.height})`);
    }

    // 生成 favicon.ico（使用 32x32 PNG）
    // 注意：sharp 不直接支持 ICO，我们生成一个 32x32 PNG 作为 favicon.ico
    // 大多数现代浏览器可以处理 PNG 格式的 .ico 文件
    const ico32Path = join(outputDir, 'favicons', 'favicon-32x32.png');
    const faviconIcoPath = join(outputDir, 'favicons', 'favicon.ico');
    if (existsSync(ico32Path)) {
      copyFileSync(ico32Path, faviconIcoPath);
      console.log(`✓ 已生成: favicons/favicon.ico (使用 32x32 PNG)`);
    }

    // 如果原图不是 SVG，也生成一个根目录的 favicon.svg（使用 32x32 PNG）
    if (!inputImage.endsWith('.svg')) {
      const faviconSvgPath = join(outputDir, 'favicon.svg');
      const png32Path = join(outputDir, 'favicons', 'favicon-32x32.png');
      if (existsSync(png32Path)) {
        // 将 PNG 转换为 SVG（简单的包装）
        const pngBuffer = await sharp(png32Path).png().toBuffer();
        const base64 = pngBuffer.toString('base64');
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><image href="data:image/png;base64,${base64}" width="32" height="32"/></svg>`;
        const fs = await import('fs');
        fs.writeFileSync(faviconSvgPath, svgContent);
        console.log(`✓ 已生成: favicon.svg (从 PNG 转换)`);
      }
    }

    console.log('\n✅ 所有 favicon 已生成完成！');
    console.log('\n📝 注意：');
    console.log('   - favicon.ico 实际上是 PNG 格式（现代浏览器支持）');
    console.log('   - 如需真正的 ICO 格式，可使用在线工具转换 favicon-32x32.png');
    
  } catch (error) {
    console.error('❌ 生成 favicon 时出错:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

generateFavicons();

