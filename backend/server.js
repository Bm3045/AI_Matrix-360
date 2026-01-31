const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'], // Add your frontend URLs
  credentials: true
}));
app.use(express.json());

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Matrix 360 AI Backend API' });
});

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, service, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields' 
      });
    }

    // Email content for admin (you receive this)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission - ${company || 'No Company'}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; text-align: center;">Matrix 360 AI - New Lead 🎯</h2>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; color: white; margin: 20px 0;">
              <h3 style="margin: 0;">Contact Details</h3>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${company || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Service Interest:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${service || 'Not specified'}</td>
              </tr>
            </table>
            
            <div style="margin: 20px 0;">
              <h4 style="color: #667eea;">Message:</h4>
              <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                ${message}
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px;">
                This lead was generated from the Matrix 360 AI Landing Page at ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Email content for user (auto-response)
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Contacting Matrix 360 AI',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; display: inline-block;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🧠 Matrix 360 AI</h1>
              </div>
            </div>
            
            <!-- Greeting -->
            <h2 style="color: #1e293b; text-align: center;">Thank You, ${name}!</h2>
            <p style="color: #64748b; text-align: center; font-size: 16px; line-height: 1.6;">
              We've received your inquiry and our AI experts will contact you within <strong>24 hours</strong>.
            </p>
            
            <!-- Details Box -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #1e293b; margin-top: 0;">Your Inquiry Details:</h3>
              <p><strong>Service Interest:</strong> ${service || 'General Inquiry'}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Reference ID:</strong> M360-${Date.now().toString().slice(-6)}</p>
            </div>
            
            <!-- Next Steps -->
            <div style="background: white; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #1e293b;">What Happens Next?</h3>
              <ol style="color: #475569; line-height: 1.8;">
                <li>Our AI consultant will review your requirements</li>
                <li>We'll schedule a free consultation call</li>
                <li>You'll receive a customized AI strategy proposal</li>
                <li>We'll discuss implementation timeline and ROI</li>
              </ol>
            </div>
            
            <!-- Contact Info -->
            <div style="text-align: center; padding: 20px; background: #f1f5f9; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #1e293b;">Need Immediate Assistance?</h3>
              <p style="color: #475569;">
                📧 <strong>Email:</strong> contact@matrix360.ai<br>
                📱 <strong>Phone:</strong> +1 (555) 123-4567<br>
                🕒 <strong>Business Hours:</strong> Mon-Fri, 9AM-6PM IST
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 14px;">
                This is an automated response. Please do not reply to this email.<br>
                © 2026 Matrix 360 AI Consulting. All rights reserved.
              </p>
              <p style="color: #64748b; font-size: 12px; font-style: italic;">
                Built for Matrix 360 AI Developer Challenge
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    // Store in database (you can add MongoDB/MySQL here)
    console.log('New contact form submission:', { name, email, company, service });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully! We will contact you soon.',
      referenceId: `M360-${Date.now().toString().slice(-6)}`
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Fallback options if email fails
    const fallbackOptions = [
      'mailgun',
      'sendgrid',
      'outlook',
      'yahoo'
    ].map(service => ({
      service,
      auth: {
        user: process.env[`${service.toUpperCase()}_USER`],
        pass: process.env[`${service.toUpperCase()}_PASS`]
      }
    }));

    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
});