function toggleTheme(to) {
  if (typeof window === 'undefined') return;
  document.querySelector('html').setAttribute('class', to);
}

toggleTheme(localStorage.getItem('theme') || 'white');
