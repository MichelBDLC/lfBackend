const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES } 
  });  

app.use(cors());
app.use(express.json());

app.get('/', (_, response) => {
    response.status(200).send('Welcome to Love & Fashion');
})

app.get('*', (_, response) => {
    response.status(404).send('Page not found');
})

//add conditionals to the form so that its only seen if received

app.post('/submit-contact-form', async (request, response) => {
    console.log(request.body)

    const {name, email, phone, city, state, message} = request.body;
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'contact@loveandfashion.nyc',
            subject: 'New Contact Form Submission',
            html: `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>City: ${city}</p>
            <p>State: ${state}</p>
            <p>Message: ${message}</p>`,
        }

        await transporter.sendMail(mailOptions);

        response.status(200).json({message: 'Contact Message Submitted Succesfully'})
    }
    catch (error) {
        console.error(error);
        response.status(500).json({error: 'Internal Server Error'})
    }
})

app.post('/submit-remoteapp-form', upload.single('file'), async (request, response) => {
    console.log(request.body)

    const {name, email, phone, city, state, age, social, message, positionsOfInterest, otherPositionChecked, otherPosition, experience, qualifications, equipment, ownOrRent, languages, otherLanguageChecked, otherLanguage, gender, shirtSize, workLegal, felony, originOfInterest} = request.body;
    const attachment = request.file;
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'contact@loveandfashion.nyc',
            subject: 'New Remote Staff Form Submission',
            html: `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Location: ${state},${city}</p>
            <p>Age: ${age} </p>
            <p>Social: ${social}</p>
            <p>Message: ${message}</p>
            <p>Positions of interest: ${otherPositionChecked === true ? positionsOfInterest + otherPosition : positionsOfInterest}</p>
            <p>Experience: ${experience}</p>
            <p>Qualifications: ${qualifications}</p>
            <p>Equipment: ${equipment}</p>
            <p>Own or Rent equipment: ${ownOrRent}</p>
            <p>Languages: ${otherLanguageChecked === true ? languages + otherLanguage : languages}</p>
            <p>Gender: ${gender}</p>
            <p>Shirt Size: ${shirtSize}</p>
            <p>Legally able to work in the U.S? ${workLegal}</p>
            <p>Felony? ${felony}</p>
            <p>Origin of Interest: ${originOfInterest}</p>`,
        }

        if (attachment) {
            mailOptions.attachments = [{
                filename: attachment.originalname,
                content: attachment.buffer,
            }];
        }

        await transporter.sendMail(mailOptions);

        response.status(200).json({message: 'Application Form Submitted Succesfully'})
    }

    catch (error) {
        console.error(error);
        response.status(500).json({error: 'Internal Server Error'})
    }
})

app.post('/submit-fieldapp-form', upload.single('file'), async (request, response) => {
    console.log(request.body)

    const {name, email, phone, city, state, age, message, positionsOfInterest, experience, qualifications, equipment, restrictions, languages, otherLanguageChecked, otherLanguage, gender, vaccination, transportation, shirtSize, workLegal, felony, originOfInterest} = request.body;
    const attachment = request.file;
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'contact@loveandfashion.nyc',
            subject: 'New Field Staff Form Submission',
            html: `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Location: ${state},${city}</p>
            <p>Age: ${age} </p>
            <p>Message: ${message}</p>
            <p>Positions of interest: ${positionsOfInterest}</p>
            <p>Experience: ${experience}</p>
            <p>Qualifications: ${qualifications}</p>
            <p>Equipment: ${equipment}</p>
            <p>Restrictions: ${restrictions}</p>
            <p>Languages: ${otherLanguageChecked === true ? languages + otherLanguage : languages}</p>
            <p>Gender: ${gender}</p>
            <p>Vaccinated? ${vaccination}</p>
            <p>Own transportation? ${transportation}</p>
            <p>Shirt Size: ${shirtSize}</p>
            <p>Legally able to work in the U.S? ${workLegal}</p>
            <p>Felony? ${felony}</p>
            <p>Origin of Interest: ${originOfInterest}</p>`,
        }

        if (attachment) {
            mailOptions.attachments = [{
                filename: attachment.originalname,
                content: attachment.buffer,
            }];
        }

        await transporter.sendMail(mailOptions);

        response.status(200).json({message: 'Application Form Submitted Succesfully'})
    }

    catch (error) {
        console.error(error);
        response.status(500).json({error: 'Internal Server Error'})
    }
})

module.exports = app;