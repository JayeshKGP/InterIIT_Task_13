const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
const express = require("express");
var cors = require('cors');
dotenv.config();
const app = express();
const uri = process.env.URI;
const client = new MongoClient(uri);
client.connect();

const database = client.db('Godowns_Items');
const godowns = database.collection('Godowns');
const items = database.collection('Items');
app.use(cors());
const PORT = process.env.PORT;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const http = require("http").createServer(app);

app.get('/task', async (req, res) => {
    console.log('started')
    var t = await godowns.find({parent_godown: null}).toArray()
    for(var i=0; i<t.length; i++){
        var hj = await godowns.find({parent_godown: t[i]['id']}).toArray()
        for(var nn=0; nn<hj.length; nn++){
            var hjq = await godowns.find({parent_godown: hj[nn]['id']}).toArray()
            if(hjq.length!=0){
                for(var gh=0; gh<hjq.length; gh++){
                    var hjqb = await godowns.find({parent_godown: hjq[gh]['id']}).toArray()
                    if(hjqb.length!=0){
                        for(var ff=0; ff<hjqb.length; ff++){
                            //var hjaq = await items.find({godown_id: hjqb[ff]['id']}).toArray()
                            var hjaq = await items.aggregate([
                                {$match: {godown_id: hjqb[ff]['id']}},
                                {$project: {
                                    name: 1,
                                    godown_id: 1,
                                    id: {$concat: ["item_", "$item_id"]}
                                }}
                            ]).toArray()
                            hjqb[ff]['children'] = hjaq;
                        }
                    }else{
                        //var hjaq = await items.find({godown_id: hjq[gh]['id']}).toArray()
                        var hjaq = await items.aggregate([
                            {$match: {godown_id: hjq[gh]['id']}},
                            {$project: {
                                name: 1,
                                godown_id: 1,
                                id: {$concat: ["item_", "$item_id"]}
                            }}
                        ]).toArray()
                        hjqb = hjaq;
                    }
                    hjq[gh]['children'] = hjqb;
                }
            }else{
                //var hjaq = await items.find({godown_id: hj[nn]['id']}).toArray()
                var hjaq = await items.aggregate([
                    {$match: {godown_id: hj[nn]['id']}},
                    {$project: {
                        name: 1,
                        godown_id: 1,
                        id: {$concat: ["item_", "$item_id"]}
                    }}
                ]).toArray()
                hjq = hjaq;
            }
            hj[nn]['children'] = hjq;
        }
        t[i]['children'] = hj;
    }
    res.send(t)
})
app.get('/info', async (req, res) => {
    var yy = req.headers.id;
    var hh = yy.substring(5)
    console.log('....')
    console.log(yy)
    console.log(hh)
    console.log('.....')
    var g = await items.findOne({item_id: hh});
    res.send(g)
})

app.get('/aa', async(req, res) => {
    res.send('hehe')
})

http.listen(PORT, () => {
    console.log('listening on *:' + PORT);
  });