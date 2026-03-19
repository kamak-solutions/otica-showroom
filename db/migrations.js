import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  console.log('🔧 Criando tabelas...');

  await sql`
    CREATE TABLE IF NOT EXISTS categorias (
      id     SERIAL PRIMARY KEY,
      slug   VARCHAR(50)  UNIQUE NOT NULL,
      nome   VARCHAR(100) NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS produtos (
      id          SERIAL PRIMARY KEY,
      categoria   VARCHAR(50)  NOT NULL REFERENCES categorias(slug),
      nome        VARCHAR(150) NOT NULL,
      marca       VARCHAR(100) NOT NULL,
      preco       VARCHAR(20)  NOT NULL,
      antigo      VARCHAR(20),
      badge       VARCHAR(50),
      cor         VARCHAR(20),
      rx          INTEGER DEFAULT 0,
      material    VARCHAR(150),
      formato     VARCHAR(100),
      genero      VARCHAR(100),
      descricao   TEXT,
      img_capa      TEXT,
      img_lateral   TEXT,
      img_detalhe   TEXT,
      img_ambiente  TEXT,
      ativo       BOOLEAN DEFAULT TRUE,
      criado_em   TIMESTAMP DEFAULT NOW(),
      atualizado_em TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    INSERT INTO categorias (slug, nome) VALUES
      ('feminino',  'Feminino'),
      ('masculino', 'Masculino'),
      ('infantil',  'Infantil'),
      ('sol',       'Óculos de Sol')
    ON CONFLICT (slug) DO NOTHING
  `;

  console.log('✅ Tabelas criadas com sucesso!');
  await sql.end();
}

migrate().catch((err) => {
  console.error('❌ Erro na migration:', err);
  process.exit(1);
});