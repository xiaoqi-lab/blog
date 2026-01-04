import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const title = args.join(' ');

if (!title) {
  console.error('Please provide a post title.');
  console.log('Usage: npm run new-post "My New Post"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const date = new Date().toISOString().split('T')[0];

const content = `---
title: "${title}"
description: ""
publishDate: "${date}"
tags: []
draft: true
---

`;

const targetDir = 'src/content/post';
const targetFile = path.join(targetDir, `${slug}.md`);

if (fs.existsSync(targetFile)) {
  console.error(`Error: File ${targetFile} already exists.`);
  process.exit(1);
}

fs.writeFileSync(targetFile, content);

console.log(`Post created successfully: ${targetFile}`);

