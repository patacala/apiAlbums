const express = require('express');
const fileupload = require('express-fileupload');
const moment = require('moment');
const app = express();


const Photo = require('../models/photo');
const fs = require('fs');
const path = require('path');


// default options
// use file upload express 
app.use(fileupload({ useTempFiles: true }));

// upload method
app.put('/upload', function(req, res){
  let body = req.body;

  // if file come
  if(!req.files){
    return res.status(400)
        .json({
          ok: false,
          err: {
            message: 'No file selected'
          }
        })
  }

  // divide file
  let file_recib = req.files.file;
  let fileNameFull = file_recib.name.split('.');
  let fileName = fileNameFull[0];
  let extension = fileNameFull[fileNameFull.length - 1];



  // Allowed extensions
  let extensionsAllowed = ['png', 'jpg', 'jpeg', 'gif'];

  if(extensionsAllowed.indexOf(extension) < 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: `Invalid extension. valid extensions are: ${extensionsAllowed.join(', ')}` 
      }
    })
  }

 
  // change name and path to save
  let milliseconds  = new Date().getMilliseconds()
  let pathUrl = `uploads/${fileName}-${ milliseconds }.${extension}`;
  let pathFake = `files/${fileName}-${ milliseconds }.${extension}`;
  fileName += `-${ milliseconds }.${extension}`
  
  // move file temp to real path
  file_recib.mv(pathUrl, (err)=>{
    if(err){
      return res.status(500)
                .json({
                  ok: false,
                  err
                })
    }

    
    let photo = new Photo({
      name: fileName,
      url: pathFake,
      size: file_recib.size,
      extension: extension,
      album: body.album,
      favorite: false,
      date: moment().format()
    });

    // call function save file
    savePhoto(photo, res);

  })

})

// function save file
function savePhoto(photo, res) {
  photo.save((err, photoDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      message: 'File uploaded successfully',
      photo: photoDB
    });
  });   
 
}

module.exports = app;
