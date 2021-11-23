class Activity {

  constructor(pool) {
    this.pool = pool;
  }

  CriarActivity({ titulo, atividade, conclusao, mensagem, id, user}) {
    return new Promise((resolve, reject) => {
      let query = `CALL CreateActivity('${conclusao}', '${titulo}', '${mensagem}','${atividade}',${user},${id});`
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  ActivityInfo({ user }) {
    return new Promise((resolve, reject) => {
      let query =`
      select a.titulo, a.descricao,ra.nota, ra.relacaoAtividades_id as id, DATE_FORMAT( a.conclusao, "%d/%m/%Y" ) as conclusao, a.atividade, ra.ativo from relacaoAtividades ra 
      inner join atividades a on 
      ra.atividades_id = a.atividades_id 
      where ra.usuarios_id = ${user} and a.ativo > 0
      ORDER BY ra.ativo asc, a.conclusao asc ;`;
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error, result: [] });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  CreatedActivities({ user }) {
    return new Promise((resolve, reject) => {
      let query =`
      SELECT a.titulo, a.atividades_id as id, a.atividade, a.ativo, a.descricao, DATE_FORMAT( a.conclusao, "%d/%m/%Y" ) as conclusao ,Concat(p.nome,' ', p.sobrenome) as nome,
      p.foto, 
      (select count(relacaoAtividades_id) from relacaoAtividades ra where ra.atividades_id = a.atividades_id) as enviados,
      (select count(relacaoAtividades_id) from relacaoAtividades ra where ra.atividades_id = a.atividades_id and ra.ativo > 1) as lidos
      from atividades a
      inner join perfil p on a.usuarios_id = p.usuarios_id
      where a.usuarios_id = ${user} and a.ativo > 0 ORDER BY a.conclusao desc;`;
      this.pool.query(query, (error, results, fields) => {
        if (error){
          console.log(error);
          reject({ err: true, message: error, result: [] });
        } 
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  PendingActivities({ user }) {
    return new Promise((resolve, reject) => {
      let query =`
      select a.titulo, a.descricao, DATE_FORMAT( a.conclusao, "%d/%m/%Y" ) as conclusao, a.atividade, ra.ativo from relacaoAtividades ra 
      inner join atividades a on 
      ra.atividades_id = a.atividades_id 
      where ra.usuarios_id = ${user} and ra.ativo = 1 and a.ativo > 0
      ORDER BY ra.ativo asc, a.conclusao asc ;`;
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error, result: [] });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  DeleteActivity({id,user}) {
    return new Promise((resolve, reject) => {
      this.pool.query(`UPDATE atividades SET ativo = 0 where ativo = 1 and atividades_id=${id} and usuarios_id =${user}`, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results.length > 0 });
      });
    });
  }

  AssignedActivity({id,user}){
    return new Promise((resolve, reject) => {
      let query =`select ra.relacaoAtividades_id as id, a.titulo, ra.ativo,DATE_FORMAT( a.conclusao, "%d/%m/%Y" ) as conclusao ,DATE_FORMAT( ra.conclusao, "%d/%m/%Y" ) as concluido, ra.atividade,ra.nota, ra.usuarios_id, Concat(p.nome,' ', p.sobrenome) as nome, p.foto,p.descricao from relacaoAtividades ra 
      inner join perfil p on ra.usuarios_id = p.usuarios_id 
      inner join atividades a on a.atividades_id = ra.atividades_id  
      where ra.atividades_id = ${id} and a.usuarios_id  = ${user};`;
      this.pool.query(query, (error, results, fields) => {
        if (error){
          console.log(error);
          reject({ err: true, message: error, result: [] });
        } 
        else resolve({ err: false, message: error, result: results })
      });
    });
 
  }

  SendActivity({id,file,user}) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE relacaoAtividades SET atividade = '${file}', ativo = 2, conclusao = now()   where ativo > 0  and relacaoAtividades_id =${id} and usuarios_id =${user}`;
      this.pool.query(query, (error, results, fields) => {
        if (error){
          console.log(error);
          reject({ err: true, message: error });
        } 
        else resolve({ err: false, message: error, result: results.length > 0 });
      });
    });
  }

  GradeActivity({id,user,nota}) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE relacaoAtividades SET nota = '${nota}', ativo = 3 where ativo > 0  and relacaoAtividades_id =${id}`;
      this.pool.query(query, (error, results, fields) => {
        if (error){
          console.log(error);
          reject({ err: true, message: error });
        } 
        else resolve({ err: false, message: error, result: results.length > 0 });
      });
    });
  }

}
module.exports = Activity;