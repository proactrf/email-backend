require('dotenv').config();

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const cors = require('cors');

// Set up Express app and Multer for file uploads
const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// Configure Nodemailer with OAuth2
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,  
        clientId: process.env.GMAIL_CLIENT_ID,                    
        clientSecret: process.env.GMAIL_CLIENT_SECRET,             
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,             
    }
});

// Endpoint to handle email sending
app.post('/send-email', upload.single('file'), async (req, res) => {
    const filePath = req.file.path; // Get the file path of the uploaded PDF

    const mailOptions = {
        from: 'it1.proactrf@gmail.com',
        to: 'paysupport@proactrf.co.za',
        subject: 'Mileage Sheet Submission',
        text: 'Please find the attached mileage sheet.',
        attachments: [
            {
                filename: 'MileageSheet.pdf',
                path: filePath
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Email sent successfully with PDF attachment!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    } finally {
        fs.unlinkSync(filePath); // Clean up uploaded file after sending
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
