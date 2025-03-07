import { contact } from "../models/contactModel.js";
import { Resend } from 'resend';
import dotenv from "dotenv";
import joi from 'joi';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchemaJoi = joi.object({
    name: joi.string().required().trim(),
    email: joi.string().email().required().lowercase().trim(),
    message: joi.string().required().trim(),
});

export const sendContactInfo = async (req, res) => {
    const { name, email, message } = req.body;

    console.log("Received contact form submission:", { name, email, message });

    try {
        // Validate the request body against the schema using Joi
        console.log("Validating form data...");
        await contactSchemaJoi.validateAsync({ name, email, message });
        console.log("Form data validation successful.");

        // Send email using Resend
        console.log("Attempting to send email via Resend...");
        const { data, error } = await resend.emails.send({
            from: 'ngoane-website@rxkonet.com',
            to: process.env.EMAIL_USER,
            subject: `New message from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        if (error) {
            console.error("Resend API Error:", error);
            throw error;
        }

        console.log("Email sent successfully! Resend Response:", data);

        // Save contact information to the database
        console.log("Saving contact information to the database...");
        const newContact = new contact({ name, email, message });
        await newContact.save();
        console.log("Contact information saved to the database.");

        res.status(200).json({ message: 'Contact information sent successfully' });
    } catch (error) {
        console.error("Error processing contact form submission:", error);

        if (error.isJoi) {
            console.error("Validation Error:", error.details);
            return res.status(400).json({ 
                error: error.details.map((detail) => detail.message) 
            });
        }
        if (error.code === 11000) { 
            console.error("Duplicate Email Error:", error);
            return res.status(400).json({ 
                error: "This email has already submitted a message" 
            });
        }
        res.status(500).json({ 
            error: "Server error. Please try again later.",
            details: error.message
        });
    }
};
