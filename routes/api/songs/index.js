var express = require('express');
var router = express.Router();
var SongsDao = require('./songs.dao');
var songs = new SongsDao();
const mailSender = require("../../../utils/mailer");

router.get('/mysongs', async (req, res, next)=>{
  try{
    const allsongs = await songs.getAll(req.user._id);
    return res.status(200).json(allsongs);
  }catch(ex){
    console.log(ex);
    return res.status(500).json({msg:"Error al procesar petición"});
  }
});

router.post('/newsong', async (req, res, next)=>{
  try{
    const {
      songartist,
      songduration,
      songname,
      songalbum,
      songgender
    } = req.body;
    const result = await songs.addNew(songartist,songduration,songname,songalbum,songgender,req.user._id);
    console.log(result);
    res.status(200).json({msg:"Nueva canción creada"});
  } catch (ex) {
    console.log(ex);
    return res.status(500).json({ msg: "Error al procesar petición" });
  }
});
router.get('/songdetail/:id', async (req, res, next)=>{
  try {
    const {id} = req.params;
    const onesongdetail = await songs.getById(id);
    return res.status(200).json(onesongdetail);
  } catch (ex) {
    console.log(ex);
    return res.status(500).json({ msg: "Error al procesar petición" });
  }
});

router.get('/facet/:page/:items', async (req, res, next) => {
  try {
    let { page, items } = req.params;
    page = parseInt(page) || 1;
    items = parseInt(items) || 10;

    const Songs = await songs.getByFacet('', page, items, req.user._id);

    return res.status(200).json(Songs);
  } catch (ex) {
    console.log(ex);
    return res.status(500).json({ msg: "Error al procesar petición" });
  }
});

router.get('/facet/:page/:items/:text', async (req, res, next)=> {
  try {
    let {page, items, text}  = req.params;
    page = parseInt(page) || 1;
    items = parseInt(items) || 10;
    const Songs = await songs.getByFacet(text, page, items, req.user._id);
    return res.status(200).json(Songs);
  } catch (ex) {
    console.log(ex);
    return res.status(500).json({ msg: "Error al procesar petición" });
  }
});
//----------------------------------------------------------------------------------------------------------

module.exports = router;
