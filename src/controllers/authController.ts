import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, CookieOptions } from 'express';
import User, { IUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

// Define an interface for the JWT payload
interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

// Helper function to verify JWT
const verifyJwt = (token: string, secret: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
};

const signToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

  if (!jwtSecret || !jwtExpiresIn) {
    throw new Error(
      'JWT_SECRET and JWT_EXPIRES_IN must be defined in environment variables.'
    );
  }

  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {

  const token = signToken(user._id.toString());

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Send JWT via cookies
  res.cookie('jwt', token, cookieOptions);

  // Remove sensitive fields
  user.password = undefined!;
  user.active = undefined!;
  user.__v = undefined!;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm, role } = req.body;

    const newUser: IUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });

    // Create and send token
    createSendToken(newUser, 201, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1. Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2. Check if user exists & password is correct
    const user: IUser | null = await User.findOne({ email }).select(
      '+password'
    );

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3. If everything ok, send token to client
    createSendToken(user, 200, res);
  }
);

export const logout = (req: Request, res: Response): void => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 'success',
  });
};

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Getting token and check if it's there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2. Verification token using custom verifyJwt function
    const decoded = await verifyJwt(token, process.env.JWT_SECRET!);

    // 3. Check if user still exists
    const currentUser: IUser | null = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4. Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    (req as any).user = currentUser;
    res.locals.user = currentUser;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes((req as any).user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
