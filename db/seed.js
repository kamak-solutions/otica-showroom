import 'dotenv/config';
import sql from './connection.js';

const dados = {
  feminino: [
    { nome: 'Élan Doré', marca: 'Vogue', preco: 'R$ 289', antigo: 'R$ 349', badge: 'NOVO', cor: '#C9A84C', rx: 28, material: 'Acetato italiano', formato: 'Gatinho', genero: 'Feminino', descricao: 'Armação gatinho de acetato premium com acabamento dourado. Design sofisticado e atemporal para quem busca elegância no dia a dia.', img_capa: 'imagens/1.png', img_lateral: 'imagens/2.png', img_detalhe: null, img_ambiente: null },
    { nome: 'Rose Soft', marca: 'Ray-Ban', preco: 'R$ 399', antigo: null, badge: null, cor: '#9a7f3c', rx: 40, material: 'Metal e acetato', formato: 'Oval', genero: 'Feminino', descricao: 'Leve e confortável, com haste em metal rosé e frente em acetato translúcido. Ideal para uso prolongado.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Belle Vue', marca: 'Oakley', preco: 'R$ 259', antigo: 'R$ 310', badge: 'OFERTA', cor: '#E8C96A', rx: 8, material: 'Titânio', formato: 'Retangular', genero: 'Feminino', descricao: 'Estrutura em titânio ultraleve com design retangular moderno. Conforto excepcional para uso diário.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Lumina', marca: 'Prada', preco: 'R$ 520', antigo: null, badge: 'PREMIUM', cor: '#C9A84C', rx: 50, material: 'Acetato italiano + detalhes dourados', formato: 'Redondo', genero: 'Feminino', descricao: 'Alta-costura óptica. Acetato de primeira linha com logo em relevo e dobradiças reforçadas em ouro 18k.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Soleil', marca: 'Vogue', preco: 'R$ 319', antigo: 'R$ 390', badge: null, cor: '#b89535', rx: 12, material: 'Acetato', formato: 'Aviador', genero: 'Feminino', descricao: 'Silhueta aviador com toque feminino. Aros duplos e haste fina que valorizam o rosto em qualquer ângulo.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Minou', marca: 'Guess', preco: 'R$ 279', antigo: null, badge: 'NOVO', cor: '#d4aa50', rx: 22, material: 'Metal dourado', formato: 'Cat Eye', genero: 'Feminino', descricao: 'Cat eye delicado em metal dourado. Ponteiras com strass e haste texturizada para um look fashion e contemporâneo.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
  ],
  masculino: [
    { nome: 'Urban Edge', marca: 'Carrera', preco: 'R$ 349', antigo: 'R$ 420', badge: 'OFERTA', cor: '#888', rx: 4, material: 'Acetato', formato: 'Quadrado', genero: 'Masculino', descricao: 'Visual urbano com estrutura robusta. Acetato de alta densidade com cantos retos para um look de autoridade.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Executive', marca: 'Ray-Ban', preco: 'R$ 459', antigo: null, badge: null, cor: '#555', rx: 6, material: 'Metal fosco', formato: 'Retangular', genero: 'Masculino', descricao: 'Clássico que nunca sai de moda. Metal fosco com lentes de 52mm, ideal para ambientes corporativos.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Retro Club', marca: 'Persol', preco: 'R$ 389', antigo: null, badge: 'NOVO', cor: '#777', rx: 50, material: 'Acetato italiano', formato: 'Redondo', genero: 'Masculino', descricao: 'Inspirado nos anos 70 com dobradiça Meflecto exclusiva da Persol. Flexível, durável e com charme vintage.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Alpinista', marca: 'Oakley', preco: 'R$ 299', antigo: 'R$ 360', badge: null, cor: '#999', rx: 30, material: 'O-Matter™ (polímero leve)', formato: 'Oval esportivo', genero: 'Masculino', descricao: 'Tecnologia Oakley para atividades ao ar livre. Leve, resistente e com sistema Three-Point Fit para ajuste perfeito.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Dark Steel', marca: 'Hugo Boss', preco: 'R$ 499', antigo: null, badge: 'PREMIUM', cor: '#666', rx: 0, material: 'Aço inoxidável escovado', formato: 'Angular', genero: 'Masculino', descricao: 'Presença e sofisticação em aço inox escovado. Linha reta e angulosa que transmite confiança e poder.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Sprint', marca: 'Oakley', preco: 'R$ 279', antigo: 'R$ 330', badge: 'OFERTA', cor: '#aaa', rx: 8, material: 'O-Matter™ + borracha Unobtainium', formato: 'Esportivo', genero: 'Masculino', descricao: 'Para quem não para. Haste com grip de borracha Unobtainium — quanto mais você sua, mais firme fica.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
  ],
  infantil: [
    { nome: 'Mini Star', marca: 'Disney', preco: 'R$ 159', antigo: null, badge: 'NOVO', cor: '#E8C96A', rx: 50, material: 'Acetato flexível', formato: 'Redondo', genero: 'Infantil (4–10 anos)', descricao: 'Armação leve e resistente com personagem Disney. Flexível para aguentar a aventura do dia a dia das crianças.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Floração', marca: 'Hello K.', preco: 'R$ 139', antigo: 'R$ 179', badge: 'OFERTA', cor: '#f08080', rx: 30, material: 'TR-90 (memória flexível)', formato: 'Oval', genero: 'Infantil (5–12 anos)', descricao: 'Delicada e resistente, com detalhes florais pintados à mão. TR-90 retorna ao formato original mesmo se dobrada.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Cubo Cool', marca: 'Nike Kids', preco: 'R$ 149', antigo: null, badge: null, cor: '#7ec8e3', rx: 10, material: 'Grilamid TR-90', formato: 'Quadrado', genero: 'Infantil (6–14 anos)', descricao: 'Estilo esportivo para os pequenos atletas. Ultraleve com ponteiras emborrachadas que evitam escorregamento.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Natureza', marca: 'Eco Kids', preco: 'R$ 129', antigo: 'R$ 159', badge: null, cor: '#90ee90', rx: 35, material: 'Bio-acetato (sustentável)', formato: 'Oval suave', genero: 'Infantil (4–12 anos)', descricao: 'Feita de bio-acetato biodegradável com cores inspiradas na natureza. Segura, leve e consciente com o planeta.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
  ],
  sol: [
    { nome: 'Top Gun', marca: 'Ray-Ban', preco: 'R$ 599', antigo: null, badge: 'PREMIUM', cor: '#C9A84C', rx: 50, material: 'Metal dourado', formato: 'Aviador', genero: 'Unissex', descricao: 'O clássico eterno. Lente G-15 com 85% de absorção de luz, armação em metal dourado e proteção UV400 total.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Classic WF', marca: 'Ray-Ban', preco: 'R$ 499', antigo: 'R$ 580', badge: 'OFERTA', cor: '#2d2d2d', rx: 4, material: 'Acetato preto', formato: 'Wayfarer', genero: 'Unissex', descricao: 'Wayfarer clássico em acetato fosco. Ícone cultural que combina com tudo — de look casual a trajes formais.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Retro Lens', marca: 'Carrera', preco: 'R$ 329', antigo: null, badge: 'NOVO', cor: '#5c4a1e', rx: 50, material: 'Acetato tartaruga', formato: 'Redondo', genero: 'Unissex', descricao: 'Estilo retrô com lentes espelhadas e acetato padrão tartaruga. Traz personalidade e proteção em igual medida.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Élégance', marca: 'Chanel', preco: 'R$ 720', antigo: null, badge: 'PREMIUM', cor: '#3d3d3d', rx: 20, material: 'Acetato + detalhes CC dourados', formato: 'Cat Eye', genero: 'Feminino', descricao: 'Alta moda em cada detalhe. Logotipo CC em dourado, lentes degradê fumê e acabamento premium que dura décadas.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Full Shield', marca: 'Oakley', preco: 'R$ 449', antigo: 'R$ 520', badge: null, cor: '#C9A84C', rx: 0, material: 'O-Matter™ + Plutonite®', formato: 'Máscara', genero: 'Masculino', descricao: 'Proteção máxima para esportes de alta intensidade. Lente Plutonite® bloqueia 100% UV-A, UV-B e UV-C.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
    { nome: 'Cosmos', marca: 'Dior', preco: 'R$ 680', antigo: null, badge: 'NOVO', cor: '#1a1a1a', rx: 40, material: 'Metal escovado + acetato', formato: 'Shield oval', genero: 'Feminino', descricao: 'Futurismo e glamour em uma só peça. Lente oval XL com aro em metal escovado e hastes em acetato marmorizado.', img_capa: null, img_lateral: null, img_detalhe: null, img_ambiente: null },
  ],
};

async function seed() {
  console.log('🌱 Iniciando seed...');

  await sql`DELETE FROM produtos`;
  await sql`DELETE FROM categorias`;

  await sql`
    INSERT INTO categorias (slug, nome) VALUES
      ('feminino',  'Feminino'),
      ('masculino', 'Masculino'),
      ('infantil',  'Infantil'),
      ('sol',       'Óculos de Sol')
    ON CONFLICT (slug) DO NOTHING
  `;

  let total = 0;
  for (const [categoria, lista] of Object.entries(dados)) {
    for (const p of lista) {
      await sql`
        INSERT INTO produtos
          (categoria, nome, marca, preco, antigo, badge, cor, rx,
           material, formato, genero, descricao,
           img_capa, img_lateral, img_detalhe, img_ambiente)
        VALUES
          (${categoria}, ${p.nome}, ${p.marca}, ${p.preco}, ${p.antigo},
           ${p.badge}, ${p.cor}, ${p.rx}, ${p.material}, ${p.formato},
           ${p.genero}, ${p.descricao}, ${p.img_capa}, ${p.img_lateral},
           ${p.img_detalhe}, ${p.img_ambiente})
      `;
      total++;
    }
  }

  console.log(`✅ Seed concluído! ${total} produtos inseridos.`);
  await sql.end();
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err.message);
  process.exit(1);
});