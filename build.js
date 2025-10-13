const fs = require('fs');
const path = require('path');

// Get all subjects by scanning articles directory
function getSubjects() {
  const articlesPath = path.join(__dirname, 'docs/articles');
  return fs.readdirSync(articlesPath).filter(file => 
    fs.statSync(path.join(articlesPath, file)).isDirectory()
  );
}

// Get all articles for a subject
function getArticles(subject) {
  const subjectPath = path.join(__dirname, 'docs/articles', subject);
  return fs.readdirSync(subjectPath)
    .filter(file => fs.statSync(path.join(subjectPath, file)).isDirectory())
    .map(article => {
      const htmlPath = path.join(subjectPath, article, `${article}.html`);
      const title = article.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      return {
        title,
        path: `../../articles/${subject}/${article}/${article}.html`
      };
    });
}

// Generate subject index page
function generateSubjectIndex(subject, articles) {
  const template = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${subject.charAt(0).toUpperCase() + subject.slice(1)} — Subjects</title>
    <link rel="stylesheet" href="../../../assets/css/style.css" />
    <style>
      /* Minimal local styles in case site stylesheet is missing */
      body { font-family: system-ui, -apple-system, Roboto, "Segoe UI", "Helvetica Neue", Arial; padding: 2rem; color: #111; }
      header { margin-bottom: 1.5rem; }
      .articles { list-style: none; padding: 0; margin: 0; }
      .article { padding: .75rem 0; border-bottom: 1px solid #eee; }
      .article h2 { margin: 0 0 .25rem 0; font-size: 1.05rem; }
      .meta { font-size: .9rem; color: #555; }
      .links a { margin-right: 1rem; }
    </style>
  </head>
  <body>
    <header>
      <h1>${subject.charAt(0).toUpperCase() + subject.slice(1)}</h1>
      <p>Articles about ${subject}</p>
    </header>
    <main>
      <ul class="articles">
        ${articles.map(article => `
        <li class="article">
          <h2>
            <a href="${article.path}">${article.title}</a>
          </h2>
        </li>`).join('')}
      </ul>
    </main>
    <footer style="margin-top:2rem;color:#666;font-size:.9rem;">
    </footer>
  </body>
</html>`;

  const outputPath = path.join(__dirname, 'docs/subjects', subject, 'index.html');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, template);
}

// Main build function
function build() {
  const subjects = getSubjects();
  
  subjects.forEach(subject => {
    const articles = getArticles(subject);
    generateSubjectIndex(subject, articles);
  });
  
  console.log('Built subject pages successfully');
}

build();