import { Request, Response } from 'express';
import { Authrequest, user, userRequestLogin, userResponse } from '../intrerface/interface';
import { userModel } from '../models/userModels';
import { Hashpassword, Passwordverification } from '../utilits/passwordUtilits';
import { generateToken } from '../utilits/jwtUtilit';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, roles }: user = req.body;
    if (!name || !email || !password || !roles) {
      res.status(400).json({ message: 'All required fields must be provided' });
      return;
    }
    const hashPassword = await Hashpassword(password);
    const result = await userModel.create({
      Name: name,
      Email: email,
      Password: hashPassword,
      Roles: roles,
    });
    if (!result) {
      res.status(404).json({
        message: 'unable to register',
      });
    }
    res.status(200).json({
      message: 'register successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'unhandled network error',
      error,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: userRequestLogin = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'All required fields must be provided' });
      return;
    }
    const user = await userModel.findOne({ Email: email }).select('+Password');

    if (!user) {
      res.status(400).json({ message: 'password not found' });
      return;
    }
    if (!user.Password || typeof user.Password !== 'string') {
      res.status(400).json({ message: 'password not found' });
      return;
    }

    const verifyPassword = await Passwordverification(password, user.Password);

    if (!verifyPassword) {
      res.status(400).json({ message: 'password mismatch' });
      return;
    }
    const jwt = generateToken(user.Email, user._id.toString(), user.Roles);
    res.status(200).json({
      message: 'jwt generated successfully',
      jwt,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: 'internal server error',
      error,
    });
  }
};

export const getUserDetails = async (req: Authrequest, res: Response): Promise<void> => {
  try {
    const userid = req.user?.userid;

    const result = await userModel.findById(userid?.toString()).select('_id Name Email Roles');
    if (!result) {
      res.status(404).json({
        message: 'user details not found',
      });
      return;
    }
    const userDetails: userResponse = {
      _id: result._id.toString(),
      name: result.Name,
      email: result.Email,
      roles: result.Roles,
    };
    res.status(200).json({
      data: userDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};
