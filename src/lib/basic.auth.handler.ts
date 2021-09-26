import express from "express";
import validator from "validator";
import { userService } from "../services/user.service";

// Error Messages
const Error_Invalid_Request = "Invalid Request";
const Error_Missing_Authorization_Header = "Missing Authorization Header";
const Error_Invalid_Username_Or_Password = "Invalid Username or Password";
const Error_Username_Is_Required = "Username is required";
const Error_Username_Is_Not_Valid = "Username is not valid";
const Error_Password_Is_Required = "Password is required";

export const basicAuthHandler = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // check for basic auth header
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    console.log(Error_Missing_Authorization_Header);
    return res
      .status(400)
      .json({ message: Error_Missing_Authorization_Header });
  }
  const base64Credentials = req.headers.authorization.split(" ")[1];

  // validate if the "Basic" string is a Base64
  let isBase64 = validator.isBase64(base64Credentials);
  if (!isBase64) {
    console.log(Error_Invalid_Request);
    return res.status(400).json({ message: Error_Invalid_Request });
  }

  // auth credentials
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );

  // Validate username and password in credentials. they cannot contain ":"
  var semicolonCount = (credentials.match(/\:/g) || []).length;
  if (semicolonCount > 1) {
    console.log(Error_Invalid_Username_Or_Password);
    return res
      .status(400)
      .json({ message: Error_Invalid_Username_Or_Password });
  }
  // extract credentials
  const [username, password] = credentials.split(":");
  if (validator.isEmpty(username)) {
    console.log(Error_Username_Is_Required);
    return res.status(400).json({ message: Error_Username_Is_Required });
  }
  if (!validator.isEmail(username)) {
    console.log(Error_Username_Is_Not_Valid);
    return res.status(400).json({ message: Error_Username_Is_Not_Valid });
  }
  if (validator.isEmpty(password)) {
    console.log(Error_Password_Is_Required);
    return res.status(400).json({ message: Error_Password_Is_Required });
  }
  //search for user
  const user = await userService.getByCredentials(username, password);
  if (!user) {
    console.log(Error_Invalid_Username_Or_Password);
    return res
      .status(401)
      .json({ message: Error_Invalid_Username_Or_Password });
  }
  next();
};
