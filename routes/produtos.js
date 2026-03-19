import sql from '../db/connection.js';

export default async function produtosRoutes(fastify) {

  // GET /api/produtos — retorna todos agrupados por categoria
  fastify.get('/api/produtos', async (request, reply) => {
    try {
      const rows = await sql`
        SELECT * FROM produtos
        WHERE ativo = true
        ORDER BY categoria, id
      `;

      // Agrupa por categoria (mesmo formato do JSON original)
      const resultado = {};
      for (const row of rows) {
        if (!resultado[row.categoria]) resultado[row.categoria] = [];
        resultado[row.categoria].push({
          id:          row.id,
          nome:        row.nome,
          marca:       row.marca,
          preco:       row.preco,
          antigo:      row.antigo,
          badge:       row.badge,
          cor:         row.cor,
          rx:          row.rx,
          material:    row.material,
          formato:     row.formato,
          genero:      row.genero,
          descricao:   row.descricao,
          imagens: {
            capa:      row.img_capa,
            lateral:   row.img_lateral,
            detalhe:   row.img_detalhe,
            ambiente:  row.img_ambiente,
          },
        });
      }

      return reply.send(resultado);
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Erro ao buscar produtos' });
    }
  });

  // GET /api/produtos/:id — retorna um produto pelo id
  fastify.get('/api/produtos/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const [produto] = await sql`
        SELECT * FROM produtos WHERE id = ${id} AND ativo = true
      `;

      if (!produto) {
        return reply.status(404).send({ error: 'Produto não encontrado' });
      }

      return reply.send({
        id:        produto.id,
        nome:      produto.nome,
        marca:     produto.marca,
        preco:     produto.preco,
        antigo:    produto.antigo,
        badge:     produto.badge,
        cor:       produto.cor,
        rx:        produto.rx,
        material:  produto.material,
        formato:   produto.formato,
        genero:    produto.genero,
        descricao: produto.descricao,
        imagens: {
          capa:     produto.img_capa,
          lateral:  produto.img_lateral,
          detalhe:  produto.img_detalhe,
          ambiente: produto.img_ambiente,
        },
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Erro ao buscar produto' });
    }
  });
}