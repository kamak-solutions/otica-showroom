export async function basicAuth(request, reply) {
  const auth = request.headers['authorization'];

  if (!auth || !auth.startsWith('Basic ')) {
    reply
      .code(401)
      .header('WWW-Authenticate', 'Basic realm="Admin"')
      .send({ error: 'Autenticação necessária' });
    return;
  }

  const base64 = auth.split(' ')[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');

  if (
    user !== process.env.ADMIN_USER ||
    pass !== process.env.ADMIN_PASSWORD
  ) {
    reply
      .code(401)
      .header('WWW-Authenticate', 'Basic realm="Admin"')
      .send({ error: 'Credenciais inválidas' });
    return;
  }
}