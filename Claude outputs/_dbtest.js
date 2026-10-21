require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.inquiry.count().then(n => console.log('DB OK, inquiries:', n)).catch(e => console.log('DB ERR', e.message.slice(0,400))).finally(() => p.$disconnect());
