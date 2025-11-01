// Test SEO API endpoint
console.log('Testing /api/admin/seo/pages endpoint...\n');

try {
  const response = await fetch('http://localhost:3000/api/admin/seo/pages');

  console.log(`Status: ${response.status} ${response.statusText}`);

  const data = await response.json();

  if (data.success) {
    console.log(`\n✅ Success! Scanned ${data.pages.length} pages`);
    console.log(`\n📊 Stats:`);
    console.log(`   Total: ${data.stats.total}`);
    console.log(`   Excellent (90+): ${data.stats.excellent}`);
    console.log(`   Good (70-89): ${data.stats.good}`);
    console.log(`   Needs Work (<70): ${data.stats.needsWork}`);
    console.log(`   Average Score: ${data.stats.averageScore}/100`);

    console.log(`\n📄 Sample pages:`);
    data.pages.slice(0, 3).forEach(page => {
      console.log(`\n   ${page.displayName} (${page.path})`);
      console.log(`   Score: ${page.score.totalScore}/100`);
      console.log(`   Title: ${page.metadata.title || '(none)'}`);
      console.log(`   Description: ${(page.metadata.description || '(none)').substring(0, 60)}...`);
      console.log(`   Keywords: ${page.metadata.keywords?.length || 0}`);
    });
  } else {
    console.log('\n❌ Error:', data.error);
    console.log('Details:', data.details);
  }
} catch (error) {
  console.error('\n❌ Failed to fetch:', error.message);
}
