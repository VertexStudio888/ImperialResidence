/* ===== Dados dos imóveis (exemplo) — partilhados por imobiliario.html e imovel.html =====
   Para acrescentar um imóvel basta juntar um objeto à lista; e criar o ficheiro imoveis_paginas/imovel-<id>.html (copiar uma das páginas existentes).
   Campos: id (usado no link), t título, z localização, tipo, neg (comprar|arrendar), p preço, q quartos,
   a área (m²), img (foto principal, id Unsplash), wc, estac, ano, estado, ce (certificado energético),
   lote (área do terreno), piso, ref, desc (parágrafos), extras (comodidades).
   Terrenos usam ainda: terreno (tipo), vedacao, acesso, util. */
const U = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const SRCSET = id => [500, 800, 1200].map(w => `${U(id, w)} ${w}w`).join(', ');
const eur = n => n.toLocaleString('pt-PT') + ' €';

const IMOVEIS = [
  { id: 'villa-horizonte', ref: 'IR-1001', t: 'Villa Horizonte', z: 'Cascais', tipo: 'Moradia', neg: 'comprar', p: 2450000, q: 5, a: 480, img: 'photo-1600596542815-ffad4c1539a9',
    wc: 6, estac: 3, ano: 2021, estado: 'Como novo', ce: 'A', lote: 1200,
    desc: ['Moradia contemporânea de linhas puras, implantada num lote generoso com vista aberta e muita luz natural em todas as divisões.',
           'Cinco suites amplas, sala de estar e jantar em open space com acesso direto ao jardim e à piscina, e acabamentos de grande qualidade.'],
    extras: ['Piscina', 'Jardim', 'Vista mar', 'Domótica', 'Ar condicionado', 'Garagem'] },
  { id: 'penthouse-atlantico', ref: 'IR-1002', t: 'Penthouse Atlântico', z: 'Lisboa', tipo: 'Apartamento', neg: 'comprar', p: 1280000, q: 3, a: 190, img: 'photo-1512917774080-9991f1c4c750',
    wc: 3, estac: 2, ano: 2019, estado: 'Usado', ce: 'A', piso: 'Último piso',
    desc: ['Penthouse no último piso com grande terraço e vista desafogada sobre o rio, numa das zonas mais procuradas da cidade.',
           'Interiores luminosos, cozinha totalmente equipada e dois lugares de garagem no edifício.'],
    extras: ['Terraço', 'Vista rio', 'Elevador', 'Lugar de garagem', 'Ar condicionado'] },
  { id: 'casa-do-patio', ref: 'IR-1003', t: 'Casa do Pátio', z: 'Comporta', tipo: 'Moradia', neg: 'comprar', p: 1890000, q: 4, a: 320, img: 'photo-1600585154340-be6161a56a0c',
    wc: 4, estac: 2, ano: 2022, estado: 'Novo', ce: 'A+', lote: 2500,
    desc: ['Moradia de piso térreo organizada em torno de um pátio central, pensada para a vida ao ar livre e para dias longos de verão.',
           'Quatro suites, grandes vãos envidraçados e painéis solares para uma casa eficiente e confortável durante todo o ano.'],
    extras: ['Piscina', 'Pátio', 'Jardim', 'Painéis solares'] },
  { id: 'loft-ribeira', ref: 'IR-1004', t: 'Loft Ribeira', z: 'Porto', tipo: 'Apartamento', neg: 'comprar', p: 465000, q: 2, a: 110, img: 'photo-1560448204-e02f11c3d0e2',
    wc: 2, estac: 1, ano: 2018, estado: 'Remodelado', ce: 'B', piso: '3.º andar',
    desc: ['Loft de pé-direito duplo a poucos passos da Ribeira, com espaços abertos e carácter industrial cuidadosamente recuperado.',
           'Dois quartos, varanda e cozinha equipada, ideal para habitação própria ou para investimento.'],
    extras: ['Pé-direito duplo', 'Elevador', 'Varanda', 'Cozinha equipada'] },
  { id: 'residencia-serra', ref: 'IR-1005', t: 'Residência Serra', z: 'Sintra', tipo: 'Moradia', neg: 'comprar', p: 980000, q: 4, a: 290, img: 'photo-1564013799919-ab600027ffc6',
    wc: 4, estac: 2, ano: 2015, estado: 'Usado', ce: 'B', lote: 1800,
    desc: ['Moradia rodeada de verde, com vista para a serra e um ambiente tranquilo a pouca distância dos principais acessos.',
           'Quatro quartos, sala com lareira e jardim com zona de refeições exterior.'],
    extras: ['Jardim', 'Lareira', 'Vista serra', 'Garagem'] },
  { id: 'terraco-do-chiado', ref: 'IR-1006', t: 'Terraço do Chiado', z: 'Lisboa', tipo: 'Apartamento', neg: 'arrendar', p: 3200, q: 2, a: 140, img: 'photo-1522708323590-d24dbb6b0267',
    wc: 2, estac: 0, ano: 2017, estado: 'Usado', ce: 'B', piso: '4.º andar',
    desc: ['Apartamento mobilado no coração do Chiado, com terraço privado e um ambiente elegante e luminoso.',
           'Disponível para arrendamento de longa duração, com serviços, comércio e transportes à porta.'],
    extras: ['Terraço', 'Mobilado', 'Elevador', 'Ar condicionado'] },
  { id: 'quinta-alvorada', ref: 'IR-1007', t: 'Quinta Alvorada', z: 'Setúbal', tipo: 'Moradia', neg: 'comprar', p: 1350000, q: 6, a: 560, img: 'photo-1613490493576-7fde63acd811',
    wc: 7, estac: 4, ano: 2010, estado: 'Remodelado', ce: 'B', lote: 12000,
    desc: ['Quinta com casa principal remodelada e mais de um hectare de terreno, entre pomar, zona de lazer e áreas de cultivo.',
           'Seis quartos, adega, furo de água e garagem para quatro viaturas, num cenário de grande privacidade.'],
    extras: ['Piscina', 'Adega', 'Pomar', 'Furo de água', 'Garagem'] },
  { id: 'studio-marina', ref: 'IR-1008', t: 'Studio Marina', z: 'Cascais', tipo: 'Apartamento', neg: 'arrendar', p: 1850, q: 1, a: 62, img: 'photo-1505691938895-1758d7feb511',
    wc: 1, estac: 1, ano: 2020, estado: 'Como novo', ce: 'A', piso: '2.º andar',
    desc: ['Apartamento T1 mobilado junto à marina, num condomínio fechado com acessos controlados.',
           'Varanda, lugar de garagem e ar condicionado, pronto a habitar.'],
    extras: ['Mobilado', 'Varanda', 'Condomínio fechado', 'Ar condicionado'] },
  { id: 'lote-vista-rio', ref: 'IR-1009', t: 'Lote Vista Rio', z: 'Setúbal', tipo: 'Terreno', neg: 'comprar', p: 390000, q: 0, a: 1200, img: 'photo-1600607687939-ce8a6c25118c',
    terreno: 'Urbano para construção', vedacao: 'Não', acesso: 'Pavimentado', util: 'Água, eletricidade e saneamento à porta',
    desc: ['Lote urbano com excelente exposição solar e vista sobre o rio, pronto para construir.',
           'Acesso pavimentado e infraestruturas junto ao limite do terreno.'],
    extras: ['Vista rio', 'Projeto aprovado', 'Boa exposição solar'] },
];

// Galeria: foto principal + duas fotos seguintes (exemplo; substituir pelas fotos reais de cada imóvel)
IMOVEIS.forEach((x, n) => {
  x.gallery = [x.img, IMOVEIS[(n + 1) % IMOVEIS.length].img, IMOVEIS[(n + 2) % IMOVEIS.length].img];
});

// Cartão usado na listagem e nos "imóveis semelhantes"
const cardHTML = (i, n = 0) => `
  <a href="imoveis_paginas/imovel-${i.id}.html" class="card rv d${n % 3}">
    <div class="ph">
      <img loading="lazy" src="${U(i.img, 800)}" srcset="${SRCSET(i.img)}" sizes="(max-width:640px) 100vw,(max-width:1000px) 50vw,33vw" alt="${i.t}" />
    </div>
    <div class="body">
      <span class="loc">${i.z} · ${i.tipo}</span>
      <h3>${i.t}</h3>
      <div class="price">${eur(i.p)}${i.neg === 'arrendar' ? ' <small style="font-size:.5em">/mês</small>' : ''}</div>
      <div class="specs">
        ${i.q ? `<span><b>${i.q}</b> quartos</span>` : ''}
        <span><b>${i.a}</b> m²</span>
      </div>
    </div>
  </a>`;
