// pages/api/contact.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Here you would typically:
        // 1. Save to database
        // 2. Send email notification
        // 3. Send confirmation email to user

        // Example using a service like SendGrid, Nodemailer, or similar:
        /*
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
        const msg = {
          to: 'support@intervaltimer.com',
          from: 'noreply@intervaltimer.com',
          subject: `Contact Form: ${subject}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        };
    
        await sgMail.send(msg);
        */

        // For now, just log the submission (in production, implement proper handling)
        console.log('Contact form submission:', {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
}

// Rate limiting helper (optional)
const submissions = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const userSubmissions = submissions.get(ip) || [];

    // Remove submissions older than 1 hour
    const recentSubmissions = userSubmissions.filter(time => now - time < 3600000);

    // Allow max 5 submissions per hour
    if (recentSubmissions.length >= 5) {
        return true;
    }

    // Update submissions
    recentSubmissions.push(now);
    submissions.set(ip, recentSubmissions);

    return false;
}