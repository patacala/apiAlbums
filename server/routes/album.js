const express = require('express');
const path = require('path');
const fs = require('fs');
const moment = require('moment');


let app = express();
let Album = require('../models/album');


// ===========================
//  Get all albums
// ===========================
app.get('/album', (req, res) => {

    Album.find()
        .limit()
        .exec((err, albums) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                albums
            });
        })
});

// ===========================
//  save album
// ===========================
app.post('/album', (req, res) => {
  let body = req.body;
  let album = new Album({
    name: body.name,
    date: moment().format()
  });
  album.save((err, albumDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      message: 'File uploaded successfully',
      album: albumDB
    });
  });   
 
});




module.exports = app;