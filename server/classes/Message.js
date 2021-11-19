class Message {

  constructor(pool) {
    this.pool = pool;
  }

  CriarMessage({ titulo, mensagem, id, user}) {
    return new Promise((resolve, reject) => {
      let query = `CALL CreateMessage('${titulo}', '${mensagem}', ${user}, ${id});`
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  CreatedMessages({ user }){
    return new Promise((resolve, reject) => {
      let query =`
      SELECT m.titulo, m.ativo, m.mensagens_id as id, m.mensagem,TIMESTAMPDIFF(MINUTE,m.envio,now()) as time ,Concat(p.nome,' ', p.sobrenome) as nome, p.foto,
      (select count(relacaoMensagens_id) from relacaoMensagens where mensagens_id = m.mensagens_id) as enviados,
      (select count(relacaoMensagens_id) from relacaoMensagens rm where mensagens_id = m.mensagens_id and rm.ativo = 2) as lidos
      from mensagens m 
      inner join perfil p on m.usuarios_id = p.usuarios_id
      where m.usuarios_id = ${user} and m.ativo > 0 ORDER BY m.envio desc;`;
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error, result: [] });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }
  
  MessageInfo({ user }) {
    return new Promise((resolve, reject) => {
      let query =`
      SELECT m.titulo, rm.ativo,p.foto, rm.relacaoMensagens_id as id, m.mensagem,TIMESTAMPDIFF(MINUTE,m.envio,now()) as time ,Concat(p.nome,' ', p.sobrenome) as nome, p.foto from relacaoMensagens rm 
      inner join mensagens m 
      on rm.mensagens_id = m.mensagens_id 
      inner join perfil p
      on m.usuarios_id = p.usuarios_id 
      where rm.usuarios_id = ${user} and m.ativo > 0
      ORDER BY m.envio desc`;
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error, result: [] });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  AtiveMessages({ user }) {
    return new Promise((resolve, reject) => {
      let query =`
      SELECT m.titulo, m.mensagem,TIMESTAMPDIFF(MINUTE,m.envio,now()) as time ,Concat(p.nome,' ', p.sobrenome) as nome, p.foto from relacaoMensagens rm 
      inner join mensagens m 
      on rm.mensagens_id = m.mensagens_id 
      inner join perfil p
      on rm.usuarios_id = p.usuarios_id
      where rm.usuarios_id = ${user} and m.ativo = 1 and rm.ativo = 1
      ORDER BY m.envio desc`;
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error, result: [] });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  DeleteMessage({id,user}) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE mensagens SET ativo = 0 where ativo > 0 and usuarios_id = ${user} and mensagens_id = ${id}`;
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results.length > 0 });
      });
    });
  }

  ReadMessage({id,user}) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE relacaoMensagens SET ativo = 2 where ativo = 1 and usuarios_id = ${user} and relacaoMensagens_id = ${id};`;
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results.length > 0 });
      });
    });
  }

}
module.exports = Message;