import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname )
    }
  })
  
  export const upload = multer(
    {
    //  storage: storage 
     storage, //es6 syntax
     }
    )



    /**
     * multer.diskStorage() is used to configure where and how the uploaded files should be stored.
     * 
The destination function specifies the directory where files will be saved ("./public/temp").

The filename function sets the name of the file when it is saved. You are using file.originalname, which will keep the original name of the file as it was uploaded.
     */


/**

multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
multer.diskStorage():

diskStorage is a method provided by multer to configure where and how the uploaded files should be stored on the disk.


Example configuration:
javascript
Copy code
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Directory where files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Save file with the original name
    }
});
const upload = multer({ storage }):

This line initializes multer and configures it to use the storage settings defined above.
multer takes an options object as an argument, and one of the options is storage, which specifies the storage engine to use.
How It Works:
Initialization:

When you write const upload = multer({ storage }), you're creating a new instance of multer that knows where to store incoming files and how to name them, according to the storage settings.
upload Middleware:

The upload variable is now a middleware function that can be used in your routes to handle file uploads.
It will process incoming file uploads according to the rules defined in storage.
Example in Use:
javascript
Copy code
import express from 'express';
import multer from 'multer';

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Files will be saved in this directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Files will be named with their original names
    }
});

// Create the multer instance with the storage configuration
const upload = multer({ storage });

const app = express();

// Example route to handle file uploads
app.post('/upload', upload.single('fileField'), (req, res) => {
    // Access the uploaded file via req.file
    console.log(req.file);

    // Send a response
    res.status(200).send('File uploaded successfully');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
Key Concepts:
storage:

Defines how and where the files will be stored on the server.
The destination function specifies the directory where files are saved.
The filename function specifies the file name on the server.
multer({ storage }):

Creates an instance of multer with the specified storage configuration.
upload becomes a middleware function that can be used in your Express routes to handle file uploads.
upload.single('fileField'):

In this example, upload.single('fileField') handles the upload of a single file from the fileField field in the form-data.
 */