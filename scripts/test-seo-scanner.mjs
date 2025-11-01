import { scanAllPages } from '../lib/seo/page-scanner.ts';

console.log('Testing SEO Page Scanner...\n');

try {
  const pages = await scanAllPages();

  console.log(`✅ Scanned ${pages.length} pages\n`);

  // Show first 3 pages as examples
  pages.slice(0, 3).forEach(page => {
    console.log(`📄 ${page.displayName} (${page.path})`);
    console.log(`   Score: ${page.score.totalScore}/100`);
    console.log(`   Title: ${page.metadata.title || '(none)'}`);
    console.log(`   Description: ${page.metadata.description?.substring(0, 60) || '(none)'}...`);
    console.log(`   Keywords: ${page.metadata.keywords?.length || 0} keywords`);
    console.log('');
  });

  // Show stats
  const excellent = pages.filter(p => p.score.totalScore >= 90).length;
  const good = pages.filter(p => p.score.totalScore >= 70 && p.score.totalScore < 90).length;
  const needsWork = pages.filter(p => p.score.totalScore < 70).length;
  const avgScore = Math.round(pages.reduce((sum, p) => sum + p.score.totalScore, 0) / pages.length);

  console.log('📊 Stats:');
  console.log(`   Total: ${pages.length}`);
  console.log(`   Excellent (90+): ${excellent}`);
  console.log(`   Good (70-89): ${good}`);
  console.log(`   Needs Work (<70): ${needsWork}`);
  console.log(`   Average Score: ${avgScore}/100`);

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
}
