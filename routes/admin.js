import sql from "../db/connection.js";
import { basicAuth } from "../middleware/auth.js";

export default async function adminRoutes(fastify) {
  // Protege a página admin
  fastify.get("/admin", { preHandler: basicAuth }, async (request, reply) => {
    return reply.sendFile("admin/index.html");
  });

  // GET /admin/api/produtos
  fastify.get(
    "/admin/api/produtos",
    { preHandler: basicAuth },
    async (request, reply) => {
      try {
        const produtos =
          await sql`SELECT * FROM produtos ORDER BY categoria, id`;
        return reply.send(produtos);
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "Erro ao buscar produtos" });
      }
    },
  );

  // POST /admin/api/produtos
  fastify.post(
    "/admin/api/produtos",
    { preHandler: basicAuth },
    async (request, reply) => {
      try {
        const p = request.body;
        const [novo] = await sql`
        INSERT INTO produtos
          (categoria, nome, marca, preco, antigo, badge, cor, rx,
           material, formato, genero, descricao,
           img_capa, img_lateral, img_detalhe, img_ambiente, ativo)
        VALUES
          (${p.categoria}, ${p.nome}, ${p.marca}, ${p.preco}, ${p.antigo ?? null},
           ${p.badge ?? null}, ${p.cor ?? "#C9A84C"}, ${p.rx ?? 0},
           ${p.material ?? null}, ${p.formato ?? null}, ${p.genero ?? null},
           ${p.descricao ?? null}, ${p.img_capa ?? null}, ${p.img_lateral ?? null},
           ${p.img_detalhe ?? null}, ${p.img_ambiente ?? null}, true)
        RETURNING *
      `;
        return reply.code(201).send(novo);
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "Erro ao criar produto" });
      }
    },
  );

  // PUT /admin/api/produtos/:id
  fastify.put(
    "/admin/api/produtos/:id",
    { preHandler: basicAuth },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const p = request.body;
        const [atualizado] = await sql`
        UPDATE produtos SET
          categoria     = ${p.categoria},
          nome          = ${p.nome},
          marca         = ${p.marca},
          preco         = ${p.preco},
          antigo        = ${p.antigo ?? null},
          badge         = ${p.badge ?? null},
          cor           = ${p.cor ?? "#C9A84C"},
          rx            = ${p.rx ?? 0},
          material      = ${p.material ?? null},
          formato       = ${p.formato ?? null},
          genero        = ${p.genero ?? null},
          descricao     = ${p.descricao ?? null},
          img_capa      = ${p.img_capa ?? null},
          img_lateral   = ${p.img_lateral ?? null},
          img_detalhe   = ${p.img_detalhe ?? null},
          img_ambiente  = ${p.img_ambiente ?? null},
          atualizado_em = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
        if (!atualizado)
          return reply.code(404).send({ error: "Produto não encontrado" });
        return reply.send(atualizado);
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "Erro ao atualizar produto" });
      }
    },
  );

  // DELETE /admin/api/produtos/:id
  fastify.delete(
    "/admin/api/produtos/:id",
    { preHandler: basicAuth },
    async (request, reply) => {
      try {
        const { id } = request.params;
        await sql`UPDATE produtos SET ativo = false WHERE id = ${id}`;
        return reply.send({ ok: true });
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "Erro ao deletar produto" });
      }
    },
  );

  // GET /admin/api/categorias
  fastify.get(
    "/admin/api/categorias",
    { preHandler: basicAuth },
    async (request, reply) => {
      try {
        const cats = await sql`SELECT * FROM categorias ORDER BY slug`;
        return reply.send(cats);
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "Erro ao buscar categorias" });
      }
    },
  );

  // POST /admin/api/upload — envia imagem para o Cloudinary
  fastify.post(
    "/admin/api/upload",
    { preHandler: basicAuth },
    async (request, reply) => {
      try {
        const data = await request.file();
        if (!data)
          return reply.code(400).send({ error: "Nenhum arquivo enviado" });

        const { v2: cloudinary } = await import("cloudinary");
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const buffer = await data.toBuffer();

        const resultado = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "otica-showroom" }, (error, result) =>
              error ? reject(error) : resolve(result),
            )
            .end(buffer);
        });

        return reply.send({ url: resultado.secure_url });
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ error: "Erro no upload" });
      }
    },
  );
}
