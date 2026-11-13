/* ===== Páginas de imóvel: galeria (clicar numa miniatura passa-a a imagem principal) ===== */
(() => {
  const gal = document.getElementById('gallery');
  if (!gal) return;
  const url = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
  gal.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.classList.contains('g-main')) return;
    const mi = gal.querySelector('.g-main img');
    const bi = b.querySelector('img');
    const mainPhoto = mi.dataset.photo, thumbPhoto = bi.dataset.photo;
    mi.dataset.photo = thumbPhoto; bi.dataset.photo = mainPhoto;
    mi.src = url(thumbPhoto, 1400);
    bi.src = url(mainPhoto, 600);
  });
})();
