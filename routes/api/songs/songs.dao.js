var conn = require('../../../utils/dao');
var ObjectID = require('mongodb').ObjectId;
var _db;
class Songs{
  songscoll =null;
  constructor(){
    this.initModel();
  }
  async initModel(){
     try {
      _db = await conn.getDB();
       this.songscoll = await _db.collection("songs");
    }catch(ex){
      console.log(ex);
      process.exit(1);
    }
  }
  async getAll(id){
    const filter = { "songuser_id": new ObjectID(id)};
    let projection = {
      "projection": {
        _id:1,
        songname:1,
        songartist:1
      }
    }
    let songs = await this.songscoll.find(filter,projection);
    return songs.toArray();
  }
  async addNew(songartist,songduration,songname,songalbum,songgender,id){
    let newsong = {
      songartist,
      songduration,
      songname,
      songalbum,
      songdate: new Date().getTime(),
      songgender,
      songuser_id: new ObjectID(id)
    }
    let result = await this.songscoll.insertOne(newsong);
    return result;
  }
  async getById(id){
    const filter = { "_id": new ObjectID(id)};
    let songdetails = await this.songscoll.findOne(filter);
    return songdetails;
  }
  async getByFacet(textToSearch, page, itemsPerPage, userId){
    const filter = {"songuser_id": new ObjectID(userId)};
    let cursor = await this.songscoll.find(filter);
    let docsMatched = await cursor.count();
    cursor.sort({songdate: 1});
    cursor.skip((itemsPerPage * (page - 1)));
    cursor.limit(itemsPerPage);
    let documents = await cursor.toArray();
    return {
      docsMatched,
      documents,
      page,
      itemsPerPage
    }
  }
}

module.exports = Songs;
