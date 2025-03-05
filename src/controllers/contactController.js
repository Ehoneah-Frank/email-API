import {contact} from "../models/contactModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import joi from 'joi';
dotenv.config();

const contactSchemaJoi = joi.object({
    name: joi.string().required().trim(),
    email: joi.string().email().required().lowercase().trim(),
    message: joi.string().required().trim(),
});

export const sendContactInfo = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Validate the request body against the schema using Joi
        await contactSchemaJoi.validateAsync({ name, email, message });

        // Create a transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Set up email data
        let mailOptions = {
            from: process.env.EMAIL_USER, // Changed from user's email to your email
            to: process.env.EMAIL_USER,
            subject: `New message from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send mail with defined transport object
        await transporter.sendMail(mailOptions);
        // Save contact information to the database
        const newContact = new contact({ name, email, message });
        await newContact.save();

        res.status(200).json({ message: 'Contact information sent successfully' });
    } catch (error) {
      if (error.isJoi){
        return res.status(400).json({ error: error.details.map((detail) => detail.message) });
      }
        res.status(400).json({ error: error.message });
    }
};
