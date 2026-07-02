import crypto from 'crypto'

const csrfCookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
}

export const issueCsrfToken = (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');

    res.cookie('csrf_token', token, csrfCookieOptions);
    res.status(200).json({
        message: 'CSRF token issued',
        csrfToken: token
    });
}

export const csrfMiddleware = (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const cookieToken = req.cookies?.csrf_token;
    const headerToken = req.headers['x-csrf-token'];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({
            message: 'Invalid CSRF token'
        });
    }

    next();
}
