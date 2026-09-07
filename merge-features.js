#!/usr/bin/env node

/**
 * MERGE SCRIPT - Neuroscience Features Integration
 *
 * Acest script merge toate features-urile create de agenți într-un singur fișier final.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting neuroscience study app integration...\n');

// Fișiere de input (create de agenți)
const files = {
  base: 'neurostiinte-improved.html',
  diagrams: 'neurostiinte-diagrams.html',
  graph: 'neurostiinte-knowledge-graph.html',
  exam: 'neurostiinte-exam-analytics.html',
  modes: 'neurostiinte-study-modes.html',
  search: 'neurostiinte-search-pwa.html',
  gamification: 'neurostiinte-gamified.html'
};

// Verifică ce fișiere există
console.log('📋 Checking available feature files:\n');
const available = {};
for (const [key, file] of Object.entries(files)) {
  const exists = fs.existsSync(file);
  available[key] = exists;
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
}
console.log();

// Citește fișierul de bază
if (!available.base) {
  console.error('❌ Base file not found! Aborting.');
  process.exit(1);
}

console.log('📖 Reading base file...');
let baseHTML = fs.readFileSync(files.base, 'utf8');

// Helper: Extrage secțiune între markers
function extractSection(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start === -1) return null;
  const end = html.indexOf(endMarker, start);
  if (end === -1) return null;
  return html.substring(start, end + endMarker.length);
}

// Helper: Înlocuiește secțiune
function replaceSection(html, oldSection, newSection) {
  return html.replace(oldSection, newSection);
}

// Merge diagrams
if (available.diagrams) {
  console.log('🎨 Merging interactive diagrams...');
  const diagramsHTML = fs.readFileSync(files.diagrams, 'utf8');

  // Extrage componenta de diagrame
  const diagramComponent = extractSection(diagramsHTML, '// DIAGRAMS COMPONENT START', '// DIAGRAMS COMPONENT END');
  if (diagramComponent) {
    baseHTML = baseHTML.replace('</script>', diagramComponent + '\n  </script>');
  }

  console.log('  ✓ Diagrams integrated');
}

// Merge knowledge graph
if (available.graph) {
  console.log('🕸️  Merging knowledge graph...');
  const graphHTML = fs.readFileSync(files.graph, 'utf8');

  // Extrage D3.js import dacă e nevoie
  if (!baseHTML.includes('d3.v7.min.js')) {
    const d3Import = '<script src="https://d3js.org/d3.v7.min.js"></script>';
    baseHTML = baseHTML.replace('</head>', `  ${d3Import}\n</head>`);
  }

  // Extrage graph component
  const graphComponent = extractSection(graphHTML, '// KNOWLEDGE GRAPH START', '// KNOWLEDGE GRAPH END');
  if (graphComponent) {
    baseHTML = baseHTML.replace('</script>', graphComponent + '\n  </script>');
  }

  console.log('  ✓ Knowledge graph integrated');
}

// Merge exam + analytics
if (available.exam) {
  console.log('🎓 Merging exam simulator + analytics...');
  const examHTML = fs.readFileSync(files.exam, 'utf8');

  const examComponent = extractSection(examHTML, '// EXAM SIMULATOR START', '// EXAM SIMULATOR END');
  if (examComponent) {
    baseHTML = baseHTML.replace('</script>', examComponent + '\n  </script>');
  }

  const analyticsComponent = extractSection(examHTML, '// ANALYTICS DASHBOARD START', '// ANALYTICS DASHBOARD END');
  if (analyticsComponent) {
    baseHTML = baseHTML.replace('</script>', analyticsComponent + '\n  </script>');
  }

  console.log('  ✓ Exam simulator integrated');
  console.log('  ✓ Analytics dashboard integrated');
}

// Merge study modes
if (available.modes) {
  console.log('📚 Merging study modes + mnemonics...');
  const modesHTML = fs.readFileSync(files.modes, 'utf8');

  const modesComponent = extractSection(modesHTML, '// STUDY MODES START', '// STUDY MODES END');
  if (modesComponent) {
    baseHTML = baseHTML.replace('</script>', modesComponent + '\n  </script>');
  }

  const mnemonicsComponent = extractSection(modesHTML, '// MNEMONICS START', '// MNEMONICS END');
  if (mnemonicsComponent) {
    baseHTML = baseHTML.replace('</script>', mnemonicsComponent + '\n  </script>');
  }

  console.log('  ✓ Study modes integrated');
  console.log('  ✓ Mnemonics integrated');
}

// Merge search + PWA
if (available.search) {
  console.log('🔍 Merging smart search + PWA...');
  const searchHTML = fs.readFileSync(files.search, 'utf8');

  const searchComponent = extractSection(searchHTML, '// SMART SEARCH START', '// SMART SEARCH END');
  if (searchComponent) {
    baseHTML = baseHTML.replace('</script>', searchComponent + '\n  </script>');
  }

  // Extrage service worker
  const swCode = extractSection(searchHTML, '// SERVICE WORKER START', '// SERVICE WORKER END');
  if (swCode) {
    fs.writeFileSync('sw.js', swCode);
    console.log('  ✓ Service worker created (sw.js)');
  }

  // Extrage manifest
  const manifestCode = extractSection(searchHTML, '/* MANIFEST START', '/* MANIFEST END');
  if (manifestCode) {
    fs.writeFileSync('manifest.json', manifestCode);
    console.log('  ✓ Manifest created (manifest.json)');
  }

  console.log('  ✓ Smart search integrated');
  console.log('  ✓ PWA infrastructure integrated');
}

// Merge gamification
if (available.gamification) {
  console.log('🏆 Merging gamification system...');
  const gamificationHTML = fs.readFileSync(files.gamification, 'utf8');

  const gamificationComponent = extractSection(gamificationHTML, '// GAMIFICATION START', '// GAMIFICATION END');
  if (gamificationComponent) {
    baseHTML = baseHTML.replace('</script>', gamificationComponent + '\n  </script>');
  }

  console.log('  ✓ Gamification integrated');
}

// Scrie fișierul final
const outputFile = 'neurostiinte-bundle.html';
console.log(`\n💾 Writing final file: ${outputFile}...`);
fs.writeFileSync(outputFile, baseHTML);

// Stats
const stats = fs.statSync(outputFile);
const sizeKB = (stats.size / 1024).toFixed(2);
console.log(`  ✓ File created: ${sizeKB} KB`);

console.log('\n🎉 Integration complete!\n');
console.log('Next steps:');
console.log('  1. Open neurostiinte-bundle.html în browser');
console.log('  2. Test toate features');
console.log('  3. Fix any bugs');
console.log('  4. Commit to git');
console.log('\nUsage: node merge-features.js\n');
