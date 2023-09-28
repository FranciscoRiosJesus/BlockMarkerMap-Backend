const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const password = require('./password')

const connectionString = `mongodb+srv://riosjesusfrancisco41:${password}@blockdb.4lnwqo2.mongodb.net/`

// MONGODB
mongoose.connect(connectionString).then(() => {
  console.log('Connected to database')
}).catch((err) => {
  console.error(err)
})

const BlockSchema = new mongoose.Schema({
  type: String,
  name: String,
  crs: {
    properties: {
      name: String
    }
  },
  features: [
    {
      properties: {
        Name: String,
        tessellate: Number,
        extrude: Number,
        visibility: Number,
        dateUpdate: Date
      },
      geometry: {
        coordinates: [
          [
            [
              Number,
              Number
            ]
          ]
        ]
      }
    }
  ]
})

const Block = mongoose.model('Block', BlockSchema)
/*
// SAVE

const block = new Block({
    type:"FeatureCollection",
    name:"blockData",
    crs:{
       properties:{
          name:"urn:ogc:def:crs:OGC:1.3:CRS84"
       }
    },
    features:[
       {
          properties:{
             Name:"1A:1",
             tessellate:-1,
             extrude:0,
             visibility:-1,
             dateUpdate: null
          },
          geometry:{
             coordinates:[
                [
                   [
                      -58.4680514,
                      -34.5360785
                   ],
                   [
                      -58.4679314,
                      -34.5363889
                   ],
                   [
                      -58.4672273,
                      -34.5360757
                   ],
                   [
                      -58.4672649,
                      -34.5360348
                   ],
                   [
                      -58.4673111,
                      -34.5360033
                   ],
                   [
                      -58.4673769,
                      -34.5359674
                   ],
                   [
                      -58.4674144,
                      -34.5359525
                   ],
                   [
                      -58.4674935,
                      -34.5359404
                   ],
                   [
                      -58.4676699,
                      -34.535958
                   ],
                   [
                      -58.4680514,
                      -34.5360785
                   ]
                ]
             ]
          }
       }
    ]
 });

block.save()
    .then((result) => {
        console.log('Block saved');
        console.log(result)
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log("ERROR: ")
        console.error(err);
    });
*/

// EXPRESS
app.use(express.json())
app.use(cors())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  Block.find({})
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.error(err)
    })
})

app.put('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const updatedTerritory = await Block.findOneAndReplace({ _id: id }, req.body, { returnNewDocument: true })
    if (!updatedTerritory) return false
    return res.json(updatedTerritory)
  } catch (err) {
    console.error(err)
  }
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
