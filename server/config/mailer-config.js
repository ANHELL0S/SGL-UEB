import nodemailer from 'nodemailer'
import { env } from './env-config.js'

export const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS,
	},
	tls: {
		rejectUnauthorized: false,
	},
})

export const defaultFromEmail = env.DEFAULT_FROM_EMAIL
