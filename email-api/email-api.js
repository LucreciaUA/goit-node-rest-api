import ElasticEmail from '@elasticemail/elasticemail-client';
import dotenv from "dotenv";
dotenv.config();

const sendVerificationEmail = async (email, verificationCode) => {
    try {
        console.log(email, verificationCode);
        const verificationLink = `https://example.com/send${verificationCode}`;
        
        // Initialize Elastic Email client
        const client = ElasticEmail.ApiClient.instance;
        const apikey = client.authentications['apikey'];
        apikey.apiKey = process.env.EMAIL_KEY;
        

        // Initialize Emails API
        const emailsApi = new ElasticEmail.EmailsApi(client);

        // Construct email data
        const emailData = {
            Recipients: [
                {
                    Email: email,
                }
            ],
            From: {
                Email: "isis.pwm@gmail.com", // Specify a valid FROM email address here
                Name: "Your Name" // Optional: Specify sender's name
            },
            Subject: "Verification Email",
            Body: {
                Html: `<p>We're happy you're here. Let's get your email address verified: <a href="${verificationLink}">Click to Verify Email</a>. If you did not register in this service, we recommend ignoring this letter.</p>`
            }
        };

        // Send email
       const data = emailsApi.emailsPost(emailData);
        console.log('Verification email sent successfully:', data);
        
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email');
    }
};

export { sendVerificationEmail };
