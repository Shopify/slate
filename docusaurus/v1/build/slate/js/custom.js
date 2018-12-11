const HighlightSidebar = {
  init() {
    this.headers = Array.from(
      document.querySelectorAll('.hash-link')
    ).reverse();
    this.sidebarLinks = Array.from(
      document.querySelectorAll('.toc-headings li')
    ).reverse();

    this.headersOffsets = this.headers.map(header => {
      var headerRect = header.getBoundingClientRect();
      return headerRect.y + window.pageYOffset - 100;
    });

    this.highlight();
  },
  highlight() {
    const highlightItemIndex = this.headersOffsets.findIndex(offset => {
      return offset < window.pageYOffset;
    });

    this.sidebarLinks.forEach(link => {
      link.classList.remove('is-visible');
    });

    if (highlightItemIndex === -1) return;

    this.sidebarLinks[highlightItemIndex].classList.add('is-visible');
  }
};

document.addEventListener(
  'DOMContentLoaded',
  function() {
    HighlightSidebar.init();
  },
  false
);

document.addEventListener(
  'scroll',
  function() {
    HighlightSidebar.highlight();
  },
  false
);
