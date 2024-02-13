// assuming top-level await for brevity
import { SMTPClient } from 'emailjs';

export default async function SendEmail(text, to, subject) {

    const client = new SMTPClient({
        user: 'niraj.sde@gmail.com',
        password: 'dzzu hhcy pqab odcf ',
        host: 'smtp.gmail.com',
        port: 465,
        ssl: true,
    });

    try {
        const messageInstance = {
            text: text,
            from: 'niraj.sde@gmail.com',
            to: to,
            subject: subject,
        }
        console.log(messageInstance,'messaage');
        const message = await client.sendAsync(messageInstance);
        
    } catch (err) {
        throw err ;
    }

}