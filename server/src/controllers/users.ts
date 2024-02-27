import User from "../model/User.js";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const users = await User.findById(id);
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    res.status(200).json(friends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addOrRemoveFriend = async (req: Request, res: Response) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((currentId) => currentId !== friendId);
      friend.friends = friend.friends.filter((currentId) => currentId !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    // const friends = await Promise.all(
    //   user.friends.map((id) => User.findById(id))
    // );

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
