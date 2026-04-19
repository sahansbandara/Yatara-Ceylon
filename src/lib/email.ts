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

export async function sendSupportReplyEmail(params: {
    to: string;
    name: string;
    subject: string;
    replyText: string;
}) {
    const text = [
        `Hello ${params.name},`,
        '',
        `We have an update regarding your support ticket: "${params.subject}"`,
        '',
        '--- Reply from our team ---',
        params.replyText,
        '---------------------------',
        '',
        'If you have any further questions, you can simply reply to this email.',
        '',
        'Best regards,',
        'Yatara Ceylon Support Team'
    ].join('\n');

    const html = `
        <div style="font-family: sans-serif; color: #333; line-height: 1.5;">
            <p>Hello ${params.name},</p>
            <p>We have an update regarding your support ticket: <strong>"${params.subject}"</strong></p>
            <div style="border-left: 4px solid #D4AF37; padding-left: 15px; margin: 20px 0; background: #f9f9f9; padding-block: 10px; padding-right: 10px;">
                <p style="margin: 0; white-space: pre-wrap;">${params.replyText}</p>
            </div>
            <p>If you have any further questions, you can simply reply to this email.</p>
            <p>Best regards,<br>Yatara Ceylon Support Team</p>
        </div>
    `;

    return sendEmail({
        to: params.to,
        subject: `Update on your ticket: ${params.subject}`,
        text,
        html,
    });
}

export async function sendPricingFinalizedEmail(params: {
    to: string;
    name: string;
    bookingNo: string;
    totalCost: number;
    advanceAmount: number;
    dashboardUrl: string;
}) {
    const fmt = (n: number) => `LKR ${n.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;

    const text = [
        `Hello ${params.name},`,
        '',
        `Great news! The pricing for your booking ${params.bookingNo} has been finalized.`,
        '',
        `Total Cost: ${fmt(params.totalCost)}`,
        `Advance Payment (20%): ${fmt(params.advanceAmount)}`,
        '',
        'You can now pay the 20% advance online through your dashboard:',
        params.dashboardUrl,
        '',
        'Once the advance is received your booking will be confirmed and our team will begin preparing your itinerary.',
        '',
        'Best regards,',
        'Yatara Ceylon Team',
    ].join('\n');

    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; max-width: 560px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #061a15 0%, #0f2e25 100%); padding: 32px 24px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #D4AF37; font-size: 22px; margin: 0 0 4px 0; letter-spacing: 1px;">Yatara Ceylon</h1>
                <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Luxury Travel &amp; Transfers</p>
            </div>
            <div style="background: #ffffff; padding: 32px 24px; border: 1px solid #eee; border-top: none;">
                <p style="margin-top:0;">Hello <strong>${params.name}</strong>,</p>
                <p>Great news! The pricing for your booking <strong>${params.bookingNo}</strong> has been finalized.</p>
                <div style="background: #f8f6f0; border-left: 4px solid #D4AF37; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 6px 0; color: #666; font-size: 14px;">Total Cost</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: bold; font-size: 16px; color: #1a1a1a;">${fmt(params.totalCost)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #666; font-size: 14px;">Advance (20%)</td>
                            <td style="padding: 6px 0; text-align: right; font-weight: bold; font-size: 16px; color: #D4AF37;">${fmt(params.advanceAmount)}</td>
                        </tr>
                    </table>
                </div>
                <p>You can now pay the 20% advance online through your dashboard. Once received, our team will begin preparing your itinerary.</p>
                <div style="text-align: center; margin: 28px 0;">
                    <a href="${params.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #D4AF37, #c59b27); color: #061a15; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; letter-spacing: 0.5px;">Pay Advance Now</a>
                </div>
                <p style="color: #999; font-size: 12px; margin-bottom: 0;">Best regards,<br>Yatara Ceylon Team</p>
            </div>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #eee; border-top: none;">
                <p style="margin: 0; font-size: 11px; color: #aaa;">© ${new Date().getFullYear()} Yatara Ceylon. All rights reserved.</p>
            </div>
        </div>
    `;

    return sendEmail({
        to: params.to,
        subject: `Booking ${params.bookingNo} — Pricing Finalized, Pay Your Advance`,
        text,
        html,
    });
}
