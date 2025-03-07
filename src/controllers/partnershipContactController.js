import { partnershipContact } from '../models/partnershipContactModel.js';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Joi validation schema for partnership contact form
const partnershipContactSchemaJoi = joi.object({
  name: joi.string().required().trim(),
  email: joi.string().email().required().lowercase().trim(),
  organization: joi.string().required().trim(),
  partnershipType: joi.string().valid(
    "Healthcare Provider",
    "Investor",
    "Government/NGO",
    "Tech Institution",
    "Patient Engagement Solutions",
    "Other"
  ).required(),
  message: joi.string().required().trim(),
});

export const contactController = {
  // Submit partnership contact form
  async submitContact(req, res) {
    const { name, email, organization, partnershipType, message } = req.body;

    console.log("Received partnership contact form submission:", { 
      name, email, organization, partnershipType, message 
    });

    try {
      // Validate the request body against the schema using Joi
      console.log("Validating form data...");
      await partnershipContactSchemaJoi.validateAsync({ 
        name, email, organization, partnershipType, message 
      });
      console.log("Form data validation successful.");

      // Send email using Resend
      console.log("Attempting to send email via Resend...");
      const { data, error } = await resend.emails.send({
        from: 'ngoane-website@rxkonet.com',
        to: process.env.EMAIL_USER,
        subject: `New Partnership Inquiry from ${name}`,
        html: `
          <h3>New Partnership Inquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Organization:</strong> ${organization}</p>
          <p><strong>Partnership Type:</strong> ${partnershipType}</p>
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
      console.log("Saving partnership contact information to the database...");
      const newContact = new partnershipContact({ 
        name, email, organization, partnershipType, message 
      });
      await newContact.save();
      console.log("Partnership contact information saved to the database.");

      // Send success response
      res.status(201).json({
        message: 'Partnership contact information sent successfully' 
      });

    } catch (error) {
      console.error("Error processing partnership contact form submission:", error);

      // Handle validation errors
      if (error.isJoi) {
        console.error("Validation Error:", error.details);
        return res.status(400).json({ 
          success: false,
          message: 'Validation Error',
          errors: error.details.map((detail) => detail.message) 
        });
      }

      // Handle duplicate email errors
      if (error.code === 11000) { 
        console.error("Duplicate Email Error:", error);
        return res.status(400).json({ 
          success: false,
          message: 'Duplicate Email Error',
          error: "This email has already submitted a partnership inquiry" 
        });
      }

      // Handle other errors
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },
};