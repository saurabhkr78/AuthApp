const crypto = require('crypto');

function generateJWTSecret() {
    const secretKey = crypto.randomBytes(64).toString('hex');
    console.log('Generated JWT Secret:', secretKey);
    return secretKey;
}

function signJWT(header, payload, secret) {
    try {
        const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const dataToSign = `${base64Header}.${base64Payload}`;
        const signature = crypto.createHmac('sha256', secret)
                               .update(dataToSign)
                               .digest('base64url');
        
        // Return complete JWT token (header.payload.signature)
        return `${dataToSign}.${signature}`;
    } catch (error) {
        throw new Error(`Failed to sign JWT: ${error.message}`);
    }
}

// Use consistent CommonJS exports
module.exports = {
    generateJWTSecret,
    signJWT
};