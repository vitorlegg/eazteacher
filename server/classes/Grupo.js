const bcrypt = require('bcrypt');

class Grupo {

  constructor(pool) {
    this.pool = pool;
  }

  CriarGrupo({img, name, description,user}) {
    return new Promise((resolve, reject) => {
      let query = `INSERT INTO grupos VALUES(null,'${name}', '${description}', '${img}', now(), 1, ${user});`
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  GrupoExiste({name}){
    return new Promise((resolve, reject) => {
      let id = name.split('#');
      if(id[0] != undefined && id[1] != undefined){
        let query = `SELECT count(grupos_id) as count FROM grupos WHERE grupos_id = ${id[1]}  AND nome = '${id[0]}';`
        this.pool.query(query, (error, results, fields) => {
          if (error) reject({ err: true, message: error, result:'errado'});
          else{
            console.log(results);
            if(results[0].count > 0){
              resolve({err:false})
            }else{
              resolve({err:true, result:'errado'})
            }
          } 
        });
      }else{
        reject({ err: true, result:'errado'});
      }
    });
  }

  ParteGrupo({name,user}){
    return new Promise((resolve, reject) => {
      let id = name.split('#');
      if(id[0] != undefined && id[1] != undefined){
        let query = `SELECT count(grupos_id) as count FROM relacaoGrupo WHERE grupos_id = ${id[1]} and usuarios_id = ${user};`
        console.log(query);
        this.pool.query(query, (error, results, fields) => {
          if (error) reject({ err: true, message: error, result:'errado'});
          else resolve({err:false, result: results[0]})
        });
      }else{
        reject({ err: true, message: error, result:'errado'});
      }
    });
  }

  RecuperarRelacao({name,user}){
    return new Promise((resolve, reject) => {
      let id = name.split('#');
      if(id[0] != undefined && id[1] != undefined){
        let query = `UPDATE relacaoGrupo SET ativo = 1 where ativo = 0 and grupos_id = ${id[1]} and usuarios_id = ${user};`;
        this.pool.query(query, (error, results, fields) => {
          if (error) reject({ err: true, message: error, result:'errado'});
          else resolve({err:false,result: 'redirect', url:'/groups'})
        });
      }else{
        reject({ err: true, message: error, result:'errado'});
      }
    });
  }

  CriarRelacao({name,user}) {
    return new Promise((resolve, reject) => {
      let id = name.split('#');
      if(id[0] != undefined && id[1] != undefined){
        let query = `INSERT INTO relacaoGrupo values(null,${user},${id[1]},1);`
        this.pool.query(query, (error, results, fields) => {
          if (error) reject({ err: false, message: error, result: true });
          else resolve({err:false,result: 'redirect', url:'/groups'})
        });
      }
    });
  }

  InfoParticipando({ user }) {
      return new Promise((resolve, reject) => {
        this.pool.query(`SELECT * FROM relacaoGrupo as rg inner join grupos g on rg.grupos_id = g.grupos_id WHERE rg.usuarios_id = ${user} and g.ativo = 1 and rg.ativo = 1;`, (error, results, fields) => {
          if (error){
            console.log(error);
            reject({ err: true, message: error,result:[] });
          } 
          else resolve({ err: false, message: error, result: results })
        });
      });
    }

  InfoCriados({ user }) {
    return new Promise((resolve, reject) => {
      this.pool.query(`SELECT * FROM grupos WHERE usuarios_id = ${user} and ativo = 1;`, (error, results, fields) => {
        if (error){
          console.log(error);
          reject({ err: true, message: error, result:[] });
        } 
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  DeleteGrupo({id,user}) {
    return new Promise((resolve, reject) => {
      this.pool.query(`UPDATE grupos SET ativo = 0 where ativo = 1 and grupos_id = ${id} and usuarios_id = ${user};`, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results.length > 0 });
      });
    });
  }

  UnfollowGroup({id,user}) {
    return new Promise((resolve, reject) => {
      this.pool.query(`UPDATE relacaoGrupo SET ativo = 0 where ativo = 1 and grupos_id = ${id} and usuarios_id = ${user};`, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results.length > 0 });
      });
    });
  }

}
module.exports = Grupo;