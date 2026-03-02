const fs = require('fs');
const path = require('path');

const DIRS = ['frontend/src', 'frontend/public', 'frontend/index.html', 'frontend/README.md', 'admin/src', 'admin/public', 'admin/index.html', 'admin/README.md', 'api/mail', 'api/notifications', 'api/app.js', 'api/routes', 'README.md', 'TECHNICAL_DOC.md', 'petio.js', 'router.js'];

const walk = (dir) => {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const stat = fs.statSync(dir);
  if (stat.isFile()) return [dir];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
};

let files = [];
DIRS.forEach(dir => {
  files = files.concat(walk(path.join(__dirname, dir)));
});

files.forEach(file => {
  if (file.match(/\.(js|jsx|ts|tsx|html|json|md)$/)) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    if (content.includes('Petio')) {
      content = content.replace(/Petio/g, 'BenFlix');
      changed = true;
    }
    if (content.includes('petio')) {
      // Be careful with petio to avoid breaking URLs or packages if possible, but the script will handle most cases
      // We will only replace standalone or specific petio instances if needed, but let's replace all for now
      // Actually, just Petio is safer. But let's replace 'petio' in text context where possible.
      // A safe way is to replace 'petio' -> 'benflix' 
      content = content.replace(/petio/g, 'benflix');
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${file}`);
    }
  }
});
