// Progressive enhancement only. No animation and no analytics.
window.addEventListener('load', function () {
  if (typeof window.renderMathInElement === 'function') {
    window.renderMathInElement(document.body, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '\\[', right: '\\]', display: true},
        {left: '\\(', right: '\\)', display: false},
        {left: '$', right: '$', display: false}
      ],
      throwOnError: false,
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    });
  }
});
