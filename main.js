//Dotenv
require('dotenv').config();

//Express
const express = require('express');
const app = express();
var session = require('express-session');

//MySQL2
const mysql = require('mysql2');
const pool = mysql.createPool({
  multipleStatements: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USUARIO,
  password: process.env.DB_SENHA,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_LIMIT,
  queueLimit: 0
});

//Multer
const update = require(__dirname + '/server/config/multer');

const path = `http://${process.env.EX_HOST}`;

//My classes
const Usuario = require(__dirname + '/server/classes/Usuario');

const Grupo = require(__dirname + '/server/classes/Grupo');

const Activity = require(__dirname + '/server/classes/Activity');

const Message = require(__dirname + '/server/classes/Message');

var usuario = new Usuario(pool);

var grupo = new Grupo(pool);

var activity = new Activity(pool)

var message = new Message(pool)

// Set Express
app.set('view engine', 'ejs');

app.set('views', __dirname + '/client/views');

app.use(express.static(__dirname + '/client/public'));

app.use(express.json());

app.use(express.urlencoded());

app.use(session({
  secret: process.env.SS_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * process.env.SS_TIMEOUT }
}));

function main() {

  const redirectLogin = (req, res, next) => {
    if (req.session.userId == undefined) {
      res.redirect(`/login`)
    } else {
      next()
    }
  }

  const redirectHome = (req, res, next) => {
    if (req.session.userId != undefined) {
      res.redirect(`/home`)
    } else {
      next()
    }
  }

  app.get('/', redirectHome, (req, res) => {
    res.redirect('/login');
  });

  app.get('/login', redirectHome, (req, res) => {
    res.render('login',{path});
  });

  app.get('/cadastrar', redirectHome, (req, res) => {
    res.render('register',{path});
  });

  app.get('/home', redirectLogin, async (req, res) => {
    let user = req.session.userId;
    let ativeMessages = await message.AtiveMessages({user});
    let pendingActivities = await activity.PendingActivities({user});
    let profile = await usuario.profileInfo({user});
    res.render('index', {path,session:req.session, ativeMessages, pendingActivities,profile});
  });

  app.get('/payments', redirectLogin, async (req, res) => {
    let user = req.session.userId;
    let ativeMessages = await message.AtiveMessages({user});
    let pendingActivities = await activity.PendingActivities({user});
    let profile = await usuario.profileInfo({user})
    res.render('payments', {path,session:req.session, ativeMessages, pendingActivities, profile});
  });

  app.get('/groups', redirectLogin, async (req, res) => {
    let user = req.session.userId;
    let ativeMessages = await message.AtiveMessages({user});
    let pendingActivities = await activity.PendingActivities({user});
    let profile = await usuario.profileInfo({user})
    const criados = await grupo.InfoCriados({user}).then().catch();
    const participando = await grupo.InfoParticipando({user}).then().catch();
    res.render('groups', {path, session: req.session, criados, participando, ativeMessages, pendingActivities,profile});
  });

  app.get('/profile', redirectLogin, async (req, res) => {
    let user = req.session.userId;
    let ativeMessages = await message.AtiveMessages({user});
    let pendingActivities = await activity.PendingActivities({user});
    let profile = await usuario.profileInfo({user})
    res.render('profile', {path, session:req.session, ativeMessages, pendingActivities, profile});
  });
  
  app.get('/messages', redirectLogin, async (req, res) => {
    let user = req.session.userId;
    let ativeMessages = await message.AtiveMessages({user});
    let pendingActivities = await activity.PendingActivities({user});
    let createdMessages = await message.CreatedMessages({user});
    let messages = await message.MessageInfo({user});
    let profile = await usuario.profileInfo({user})
    res.render('messages', {path,session:req.session,messages, ativeMessages, pendingActivities, createdMessages, profile});
  });

  app.get('/activities', redirectLogin, async (req, res) => {
    let user = req.session.userId;
    let ativeMessages = await message.AtiveMessages({user});
    let pendingActivities = await activity.PendingActivities({user});
    let activities = await activity.ActivityInfo({user});
    let createdActivities = await activity.CreatedActivities({user});
    let profile = await usuario.profileInfo({user})
    res.render('activities', {path,session:req.session,activities, ativeMessages, pendingActivities,createdActivities,profile});
  });

  app.get('/settings', redirectLogin, async(req, res) => {
    res.render('settings', {path,session:req.session});
  });

  app.get('/pessoa', redirectLogin, async (req, res) => {
    let user = req.session.userId;
    let ativeMessages = await message.AtiveMessages({user});
    let pendingActivities = await activity.PendingActivities({user});
    let profile = await usuario.profileInfo({user});
    let assignedActivity =  await activity.AssignedActivity({id:req.query.id,user});
    console.log(assignedActivity);
    res.render('pessoas', {path,session:req.session,ativeMessages,pendingActivities,profile, assignedActivity});
  });

  app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      res.redirect('/login');
     });
  });

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (password || email) {
      usuario.Login({ email: email, senha: password }).then((arg) => {
        req.session.userId = arg.result.usuarios_id;
        req.session.email = arg.result.email;
        req.session.nome = arg.result.nome;
        req.session.sobrenome = arg.result.sobrenome;
        return res.status(200).send({result: 'redirect', url:'/home'});
      }).catch((arg) => {
        return res.status(200).send(arg);
      });
    }
  });

  app.post('/cadastrar',async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    if (password == confirmPassword) {
      const usuarioExistente = await usuario.UsuarioExistente({email});
      if(usuarioExistente.result.count > 0){
        return res.status(200).send({result: 'errado'});;
      }
      usuario.CriarUsuario({ email: email, senha: password, nome: firstName, sobrenome: lastName }).then((arg) => {
        usuario.UserInfo({ email }).then((arg) => {
          req.session.userId = arg.result[0].usuarios_id
          req.session.email = arg.result[0].email
          req.session.nome = arg.result[0].nome
          req.session.sobrenome = arg.result[0].sobrenome
          return res.status(200).send({result: 'redirect', url:'/home'});
        }).catch((arg) => {
          console.log(arg);
        })
      }
      ).catch((arg) => {
        console.log(arg);
      });
    }else res.redirect('/login');
  });

  app.post('/createGroup', update.single('file'), (req, res) => {
    let img;
    if(req.file)img =  req.file.location;
    const {name, description} = req.body;
    grupo.CriarGrupo({img, name, description, user: req.session.userId}).then((results)=>{
      res.status(200);
      return res.status(200).send({result: 'redirect', url:'/groups'});
    }).catch((err)=>{
      console.log(err);
    })
  });

  app.post('/deleteGroup', (req, res) => {
    const {id} = req.body;
    grupo.DeleteGrupo({id,user:req.session.userId}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/groups'})
    }).catch((err)=>{
      console.log(err);
    })
  });

  app.post('/participateGroup', async (req, res) => {
    try {
      const {name} = req.body;
      let user = req.session.userId;

      const grupoExiste = await grupo.GrupoExiste({name});
      if(grupoExiste.err){
        return res.status(200).send(grupoExiste);
      }

      const parteGrupo = await grupo.ParteGrupo({name,user});
      if(parteGrupo.err){
        return res.status(200).send(parteGrupo);
      }
      console.log(parteGrupo);
      if (parteGrupo.result.count > 0) {
        const recuperarRelacao = await  grupo.RecuperarRelacao({name,user});
        if(recuperarRelacao.err){
          return res.status(200).send(recuperarRelacao);
        }
        return res.status(200).send(recuperarRelacao);
      } else {
        const criarRelacao = await grupo.CriarRelacao({name,user});
        if(criarRelacao.err){
          return res.status(200).send(criarRelacao);
        }
        return res.status(200).send(criarRelacao);
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send(err);
    }
  });

  app.post('/unfollowGroup', (req, res) => {
    const {id} = req.body;
    grupo.UnfollowGroup({id, user:req.session.userId}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/groups'});
    }).catch((err)=>{
      console.log(err);
    })
  });

  app.post('/createActivity',update.single('file'), (req, res) => {
    let atividade;
    if(req.file)atividade =  req.file.location
    const {titulo, conclusao, mensagem, id} = req.body;
    activity.CriarActivity({titulo, atividade,conclusao, mensagem, id, user:req.session.userId}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/groups'});
    }).catch((err)=>{
      console.log(err);
    })
  });

  app.post('/createMessage', (req, res) => {
    const {titulo, mensagem, id} = req.body;
    message.CriarMessage({titulo, mensagem, id, user:req.session.userId}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/groups'});
    }).catch((err)=>{
      console.log(err);
    })
  });

  app.post('/readMessage', (req, res) => {
    const {id} = req.body;
    message.ReadMessage({id, user:req.session.userId}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/messages'});
    }).catch((err)=>{
      return res.status(400)
    })
  });

  app.post('/deleteMessage', (req, res) => {
    const {id} = req.body;
    message.DeleteMessage({id, user: req.session.userId}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/messages'});
    }).catch((err)=>{

      console.log(err);
      return res.status(400);
    })
  });

  app.post('/deleteActivity', (req, res) => {
    const {id} = req.body;
    activity.DeleteActivity({id, user: req.session.userId}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/activities'});
    }).catch((err)=>{

      console.log(err);
      return res.status(400);
    })
  }); 

  app.post('/updateProfile',update.single('file'), (req, res) => {
    let file;
    if(req.file) file =  req.file.location;
    const {nome, sobrenome,mensagem} = req.body;
    usuario.UpdateUsuario({nome, sobrenome, mensagem, file, user:req.session.userId}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/profile'});
    }).catch((err)=>{
      console.log(err);
    })
  }); 

  app.post('/sendActivity',update.single('file'), (req, res) => {
    let file;
    if(req.file) file =  req.file.location;
    const {id} = req.body;
    activity.SendActivity({id,file, user:req.session.userId}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/activities'});
    }).catch((err)=>{
      console.log(err);
    })
  }); 

  app.post('/gradeActivity', (req, res) => {
    const {id,user,nota} = req.body;
    activity.GradeActivity({id, user,nota}).then((results)=>{
      return res.status(200).send({result: 'redirect', url:'/activities'});
    }).catch((err)=>{
      console.log(err);
    })
  }); 

  app.listen(process.env.EX_PORT, () => console.log(`http://${process.env.EX_HOST}:${process.env.EX_PORT}`));
} main()