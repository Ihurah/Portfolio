import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const distPath = path.join(__dirname, '../dist');
const srcPath = path.join(__dirname, '../src');
const publicPath = path.join(__dirname, '../public');

const srcAppCssPath = path.join(srcPath, 'App.css');
const srcIndexCssPath = path.join(srcPath, 'index.css');
const distStylePath = path.join(distPath, 'assets/style.css');

let mergedCss = '';

try {
  if (fs.existsSync(srcIndexCssPath)) {
    mergedCss += fs.readFileSync(srcIndexCssPath, 'utf-8') + '\n';
  }
  if (fs.existsSync(srcAppCssPath)) {
    mergedCss += fs.readFileSync(srcAppCssPath, 'utf-8') + '\n';
  }
} catch (err) {
  console.error('Error reading CSS files:', err);
}

if (mergedCss) {
  try {
    fs.writeFileSync(distStylePath, mergedCss, 'utf-8');
    console.log('✓ Merged CSS written to dist/assets/style.css');
  } catch (err) {
    console.error('Error writing merged CSS:', err);
  }
}

// Copy 404.html from public to dist
const public404Path = path.join(publicPath, '404.html');
const dist404Path = path.join(distPath, '404.html');

if (fs.existsSync(public404Path)) {
  try {
    fs.copyFileSync(public404Path, dist404Path);
    console.log('✓ Copied 404.html to dist');
  } catch (err) {
    console.error('Error copying 404.html:', err);
  }
}

// Sync the head of 404.html with index.html
const distIndexPath = path.join(distPath, 'index.html');
const src404CssPath = path.join(srcPath, '404.css');

if (fs.existsSync(distIndexPath) && fs.existsSync(dist404Path)) {
  try {
    const indexContent = fs.readFileSync(distIndexPath, 'utf-8');
    const public404Content = fs.readFileSync(public404Path, 'utf-8');
    let notFoundContent = fs.readFileSync(dist404Path, 'utf-8');
    
    // Read 404.css for custom styles
    let custom404Style = '';
    if (fs.existsSync(src404CssPath)) {
      custom404Style = fs.readFileSync(src404CssPath, 'utf-8');
    }
    
    // Extract head from index.html
    const headMatch = indexContent.match(/<head>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      const indexHead = headMatch[1];
      
      // Replace head in 404.html
      notFoundContent = notFoundContent.replace(
        /<head>([\s\S]*?)<\/head>/i,
        `<head>${indexHead}${custom404Style ? '\n    <style>\n      ' + custom404Style.split('\n').join('\n      ') + '\n    </style>' : ''}</head>`
      );
      
      // Inject style.css reference if not present
      if (!notFoundContent.includes('style.css')) {
        notFoundContent = notFoundContent.replace(
          '</head>',
          `  <link rel="stylesheet" href="/assets/style.css">\n</head>`
        );
      }
      
      fs.writeFileSync(dist404Path, notFoundContent, 'utf-8');
      console.log('✓ Synced 404.html head with index.html');
    }
  } catch (err) {
    console.error('Error syncing 404.html:', err);
  }
}
