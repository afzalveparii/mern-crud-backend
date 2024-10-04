import { Request, Response } from 'express';
import moment from 'moment';
import csv from 'fast-csv';
import fs from 'fs';
import User from '../models/usersSchema';

const BASE_URL = process.env.BASE_URL;

class UsersController {
  async userPost(req: Request, res: Response): Promise<void> {
    const file = req.file?.filename;
    const { fname, lname, email, phoneNumber, gender, address, status } = req.body;

    if (!fname || !lname || !email || !phoneNumber || !gender || !address || !status || !file) {
      res.status(401).json("All Inputs are required");
      return;
    }

    try {
      const preuser = await User.findOne({ email: email });

      if (preuser) {
        res.status(401).json("This user already exists in our database");
      } else {
        const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const userData = new User({
          fname, lname, email, phoneNumber, gender, address, status, profile: file, datecreated
        });
        await userData.save();
        res.status(200).json(userData);
      }
    } catch (error) {
      res.status(401).json(error);
      console.log("catch block error");
    }
  }

  async userGet(req: Request, res: Response): Promise<void> {
    const search = req.query.search as string || "";
    const gender = req.query.gender as string || "";
    const status = req.query.status as string || "";
    const sort = req.query.sort as string || "";
    const page = parseInt(req.query.page as string) || 1;
    const ITEM_PER_PAGE = 4;

    const query: any = {
      fname: { $regex: search, $options: "i" }
    };

    if (gender !== "All") {
      query.gender = gender;
    }

    if (status !== "All") {
      query.status = status;
    }

    try {
      const skip = (page - 1) * ITEM_PER_PAGE;
      const count = await User.countDocuments(query);
      const usersdata = await User.find(query)
        .sort({ datecreated: sort == "new" ? -1 : 1 })
        .limit(ITEM_PER_PAGE)
        .skip(skip);

      const pageCount = Math.ceil(count / ITEM_PER_PAGE);

      res.status(200).json({
        Pagination: {
          count, pageCount
        },
        usersdata
      });
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async singleUserGet(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const userdata = await User.findOne({ _id: id });
      res.status(200).json(userdata);
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async userEdit(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { fname, lname, email, phoneNumber, gender, address, status, user_profile } = req.body;
    const file = req.file ? req.file.filename : user_profile;

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
      const updateuser = await User.findByIdAndUpdate({ _id: id }, {
        fname, lname, email, phoneNumber, gender, address, status, profile: file, dateUpdated
      }, {
        new: true
      });

      if (updateuser) {
        await updateuser.save();
        res.status(200).json(updateuser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async userDelete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const deletuser = await User.findByIdAndDelete({ _id: id });
      res.status(200).json(deletuser);
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async userStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { data } = req.body;

    try {
      const userstatusupdate = await User.findByIdAndUpdate({ _id: id }, { status: data }, { new: true });
      res.status(200).json(userstatusupdate);
    } catch (error) {
      res.status(401).json(error);
    }
  }

  async userExport(req: Request, res: Response): Promise<void> {
    try {
      const usersdata = await User.find();

      const csvStream = csv.format({ headers: true });

      if (!fs.existsSync("public/files/export/")) {
        if (!fs.existsSync("public/files")) {
          fs.mkdirSync("public/files/");
        }
        if (!fs.existsSync("public/files/export")) {
          fs.mkdirSync("./public/files/export/");
        }
      }

      const writablestream = fs.createWriteStream(
        "public/files/export/users.csv"
      );

      csvStream.pipe(writablestream);

      writablestream.on("finish", function () {
        res.json({
          downloadUrl: `${BASE_URL}/files/export/users.csv`,
        });
      });

      if (usersdata.length > 0) {
        usersdata.forEach((user) => {
          csvStream.write({
            FirstName: user.fname || "-",
            LastName: user.lname || "-",
            Email: user.email || "-",
            Phone: user.phoneNumber || "-",
            Gender: user.gender || "-",
            Status: user.status || "-",
            Profile: user.profile || "-",
            Address: user.address || "-",
            DateCreated: user.datecreated || "-",
            DateUpdated: user.dateUpdated || "-",
          });
        });
      }
      csvStream.end();
      writablestream.end();

    } catch (error) {
      res.status(401).json(error);
    }
  }
}

export default new UsersController();