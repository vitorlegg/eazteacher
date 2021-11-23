const bcrypt = require('bcrypt');

class Usuario {

  constructor(pool) {
    this.pool = pool;
  }
  UsuarioExistente({email}){
    return new Promise((resolve, reject) => {
      let query = `select count(usuarios_id) as count from usuarios where email = '${email}';`;
      this.pool.query(query, (err, results, fields) => {
        if (err) reject({ err: true, message: error });
        else{
          resolve({ err: false, result: results[0]})
        } 
      });
    });
  }

  CriarUsuario({ email, senha, nome, sobrenome}) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(senha, parseInt(process.env.SALTROUNDS), (err, hash) =>{
        if (!err) {
          let query = `INSERT INTO usuarios VALUES(null,'${email}','${hash}',1);
          SELECT @id_key := last_insert_id() FROM usuarios;
          INSERT INTO perfil VALUES(null,'${nome}','${sobrenome}',null,null,@id_key);`

          this.pool.query(query, (error, results, fields) => {
            if (error) reject({ err: true, message: error });
            else resolve({ err: false, message: error, result: results })
          });
        }else console.log(err);
      });
    });
  }
  
  Login({ email, senha }) {
    return new Promise((resolve, reject) => {
      this.pool.query(`select * from usuarios as u inner join perfil as p on u.usuarios_id = p.usuarios_id where email = '${email}' and ativo = 1;`, (error, results, fields) => {
        if (error) reject({ err: true, message: error,  result:'errado'});
        else {
          if(results[0] != undefined){
            bcrypt.compare(senha, results[0].senha, (err, result) => {
              if (err) reject({ err: true, message: error, result:'errado' });
              else if (!result) reject({ err: true,result:'errado' });
              else resolve({ err: false, message: error, result: results[0]});
            });
          }else reject({ err: false, result:'errado' });
        }
      });
    }); 
  }

  UserInfo({ email }) {
    return new Promise((resolve, reject) => {
      this.pool.query(`select * from usuarios as u inner join perfil as p on u.usuarios_id = p.usuarios_id where email = '${email}' and ativo = 1`, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  profileInfo({user}){
    return new Promise((resolve, reject) => {
      let query = `select p.nome, p.sobrenome, p.descricao, p.foto from usuarios as u 
      inner join perfil as p on u.usuarios_id = p.usuarios_id 
      where u.usuarios_id = ${user} and u.ativo = 1;`;
      this.pool.query(query, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  CheckSessions({ id , email }) {
    return new Promise((resolve, reject) => {
      this.pool.query(`Select * from usuarios where email = '${email}' and usuarios_id = ${id};`, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results })
      });
    });
  }

  DeleteUsuario({ email, senha, nome, sobrenome, ativo }) {
    return new Promise((resolve, reject) => {
      this.pool.query(`UPDATE usuarios SET ativo = 0 where ativo = 1 and email = '${email}'`, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results.length > 0 });
      });
    });
  }

  UpdateUsuario({ nome, sobrenome, mensagem, file, user}) {
    return new Promise((resolve, reject) => {
      this.pool.query(`UPDATE perfil SET nome = '${nome}', sobrenome ='${sobrenome}', descricao='${mensagem}', foto ='${file}' where usuarios_id = ${user}`, (error, results, fields) => {
        if (error) reject({ err: true, message: error });
        else resolve({ err: false, message: error, result: results.length > 0 });
      });
    });
  }

}
module.exports = Usuario;