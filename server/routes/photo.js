const express = require('express');
const path = require('path');
const fs = require('fs');


let app = express();
let Photo = require('../models/photo');
let Album = require('../models/album')

// ===========================
//  Get all Photos
// ===========================
app.get('/photo', (req, res) => {

    let albumPromises = []
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Photo.find({})
        .limit()
        // .populate('album')
        .exec((err, photos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }       
              
              res.json({
                ok: true,
                photos
              });              
           
        })
});


// ===========================
//  Delete Photo
// ===========================
app.delete('/photo/:id', function(req, res){

  let id = req.params.id;
  Photo.findById(id, (err, photoRecib) => {

    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if (!photoRecib) {
      return res.status(400).json({
          ok: false,
          err: {
              message: 'ID no exist: '+id
          }
      });
    }    

    // use path to use
    let pathImage = path.resolve(__dirname, `../../uploads/${photoRecib.name}`);
   
    // if path exist delete and clean photo from database
    if(fs.existsSync(pathImage)){
      fs.unlinkSync(pathImage);     

      Photo.deleteOne({name: photoRecib.name})
      .then(result => console.log(`Deleted ${result.deletedCount} item.`))
      .catch(err => console.error(`Delete failed with error: ${err}`))

      return res.json({
        ok: true,
        message: 'Photo deleted successfully'
      });
    }

    return res.status(500).json({
      ok: false,
      message: {
        err: 'The image could not be deleted try again'
      }
    });

   
      

  });
});

// ===========================
//  Search photos by album id
// ===========================
app.get('/photo/find-album/:value', (req, res) => {

    let value = req.params.value;

    Photo.find({ album : `${value}` })
        .limit(10000)
        .exec((err, photos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                photos
            })

        })


});


// ===========================
//  Search photos by name like
// ===========================
app.get('/photo/find/:value', (req, res) => {

    let value = req.params.value;

    Photo.find({ name : {'$regex': `${value}`} })
        .limit(10000)
        .exec((err, photos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                photos
            })

        })


});


// // ===========================
// //  UpdatePhoto
// // ===========================
app.put('/photo/:id', (req, res) => {

  let id = req.params.id;
  let body = req.body;

  Photo.findById(id, (err, photoDB) => {

      if (err) {
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!photoDB) {
          return res.status(400).json({
              ok: false,
              err: {
                  message: 'Not exist ID'
              }
          });
      }

      photoDB.name = body.name;
      photoDB.url = body.url;
      photoDB.size = body.size;
      photoDB.extension = body.extension;
      photoDB.album = body.album;
      photoDB.favorite = body.favorite;
      photoDB.date = body.date;

      photoDB.save((err, photoSaved) => {
          if (err) {
              return res.status(500).json({
                  ok: false,
                  err
              });
          }

          res.json({
              ok: true,
              photo: photoSaved
          });

      });

  });


});
  

module.exports = app;