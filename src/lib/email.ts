import nodemailer from 'nodemailer';

interface EmailPayload {
    to: string;
    subject: string;
    text: string;
    html: string;
}

function createTransport() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

async function sendEmail(payload: EmailPayload) {
    const transport = createTransport();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    if (!transport || !from) {
        console.warn('Email delivery skipped because SMTP is not configured.', {
            to: payload.to,
            subject: payload.subject,
        });
        console.info(payload.text);
        return { delivered: false };
    }

    await transport.sendMail({
        from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
    });

    return { delivered: true };
}

export async function sendVerificationEmail(params: {
    to: string;
    name: string;
    verificationUrl: string;
    mode?: 'signup' | 'resend';
}) {
    const isResend = params.mode === 'resend';
    const text = [
        `Hello ${params.name},`,
        '',
        'Verify your Yatara Ceylon account by opening the link below:',
        params.verificationUrl,
        '',
        isResend ? 'This new link replaces any previous verification emails.' : null,
        isResend ? 'Only the most recent verification link will work.' : null,
        'This link will expire in 24 hours.',
    ].filter(Boolean).join('\n');

    const html = `
        <p>Hello ${params.name},</p>
        <p>Verify your Yatara Ceylon account by opening the link below:</p>
        <p><a href="${params.verificationUrl}">${params.verificationUrl}</a></p>
        ${isResend ? '<p>This new link replaces any previous verification emails. Only the most recent verification link will work.</p>' : ''}
        <p>This link will expire in 24 hours.</p>
    `;

    return sendEmail({
        to: params.to,
        subject: isResend
            ? 'Your new Yatara Ceylon verification link'
            : 'Verify your Yatara Ceylon account',
        text,
        html,
    });
}

export async function sendPasswordResetEmail(params: {
    to: string;
    name: string;
    resetUrl: string;
}) {
    const text = [
        `Hello ${params.name},`,
        '',
        'Reset your Yatara Ceylon password by opening the link below:',
        params.resetUrl,
        '',
        'This link will expire in 1 hour and can only be used once.',
    ].join('\n');

    const html = `
        <p>Hello ${params.name},</p>
        <p>Reset your Yatara Ceylon password by opening the link below:</p>
        <p><a href="${params.resetUrl}">${params.resetUrl}</a></p>
        <p>This link will expire in 1 hour and can only be used once.</p>
    `;

    return sendEmail({
        to: params.to,
        subject: 'Reset your Yatara Ceylon password',
        text,
        html,
    });
}
