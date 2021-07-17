const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const nodemailer = require("nodemailer");
const axios = require("axios").default
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const Keys = require('../../config/keys.js')
//MAIL
var transporter = nodemailer.createTransport({
  // service: "gmail",
  host:'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    // user: Keys.EMAIL,
    // pass: Keys.EMAIL_PASSWORD,
    user: 'betterlife2134@gmail.com',
    pass: '@nkur2134',
  },

});


const SendMail = (To_Patient, To_Doctor,Meet_ID,Doctor_name,Patient_name) => {
  var mailOptions = {
    from: `etterlife2134@gmail.com`,
    to: `${To_Patient},${To_Doctor}`,
    subject: "Docotor Appiontment Confirmation",
    html:  `
    <table>
    <tr style="height:50px;">
        <td valign="center"><strong>Meeting ID :</strong></td>
        <td valign="center">${Meet_ID}</td>
    </tr>
  
    <tr style="height:50px;">
        <td valign="center"><strong>Refer to :</strong></td>
        <td valign="center">${Doctor_name}</td>
    </tr>
    <tr style="height:50px;">
        <td valign="center"><strong>Patient Name :</strong></td>
        <td valign="center">${Patient_name}</td>
    </tr>
  </table>
  <ul>
  <li>Go To  <a href="${Keys.WEEBMEET}">${Keys.WEEBMEET}</a></li>
  <li>SignIn or SignUp</li>
  <li>Pasete your <strong>Meeting ID</strong> in Join Meeting</li>
</ul>
  `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("error"+error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// Load User model
const User = require("../../models/User");
const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { firstName, lastName, DOB, Gender, email, password1, password2 } =
    req.body;
  console.log(req.body);
  // const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res
        .json({ color: "error", message: "Email already exists" })
        .status(400);
    } else {
      const newUser = new User({
        Firstname: req.body.firstName,
        Lastname: req.body.lastName,
        email: req.body.email,
        Gender: req.body.Gender,
        DOB: req.body.DOB,
        password: req.body.password1,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) =>
              res.json({
                color: "success",
                message: "Registeraton Successfully done..",
              })
            )
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  // Form validation

  // const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  // const email = req.body.email;
  // const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.json({ emailnotfound: "Email not found" }).status(404);
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const Fullname = user.Firstname + " " + user.Lastname;
        const payload = {
          id: user.id,
          name: Fullname,
          email: email,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res

          .json({ passwordincorrect: "Password incorrect" })
          .status(400);
      }
    });
  });
});

//Doctor Auth

// {
//   "Fullname": "Dr Vinod Kumar",
//   "email": "ankurmaurya70@gmail.com",
//   "Gender": "male",
//   "DOB": "1974-06-07",
//   "Location": "Mumbai",
//   "Mobile": "1212121212",
//   "Info": "",
//   "Experience": "25 Years",
//   "Specialist": "Physician",
//   "password": "123"
// }

router.post("/Docotorregister", (req, res) => {
  // Form validation
  const {
    Fullname,
    DOB,
    Gender,
    email,
    password,
    Location,
    Mobile,
    Info,
    Experience,
    Specialist,
  } = req.body;
  // console.log(req.body);
  // const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res
        .json({ color: "error", message: "Email already exists" })
        .status(400);
    } else {
      const newDoctor = new Doctor({
        Fullname: req.body.Fullname,
        email: req.body.email,
        Gender: req.body.Gender,
        DOB: req.body.DOB,
        Location: req.body.Location,
        Mobile: req.body.Mobile,
        Info: req.body.Info,
        Experience: req.body.Experience,
        Specialist: req.body.Specialist,
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newDoctor.password, salt, (err, hash) => {
          if (err) throw err;
          newDoctor.password = hash;
          newDoctor
            .save()
            .then((user) =>
              res.json({
                message: "Registeraton Successfully done..",
              })
            )
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/Docotorlogin", (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  // Form validation

  // const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  // const email = req.body.email;
  // const password = req.body.password;

  // Find user by email
  Doctor.findOne({ email }).then((user) => {
    console.log(user);
    // Check if user exists
    if (!user) {
      return res.json({ emailnotfound: "Email not found" }).status(404);
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.Fullname,
          email: user.email,
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res

          .json({ passwordincorrect: "Password incorrect" })
          .status(400);
      }
    });
  });
});

// getalldocotor

router.get("/alldocotor", async (req, res) => {
  Doctor.find({}, (err, data) => {
    // console.log(data);
    res.json({ data: data });
  });
});

//Make Appointments
router.post("/appointmets", async (req, res) => {
  const { Patientname, Doctorname, PatientEmail, DoctorEmail, Reason, Status } =
    req.body;
  // console.log(req.body)
  // User.findOne({email : PatientEmail},async(res,err)=>{
  // if(res===1){
  //console.log(res)
  // console.log('ank')
  const makeAppointment = new Appointment({
    Patientname: Patientname,
    Doctorname: Doctorname,
    PatientEmail: PatientEmail,
    DoctorEmail: DoctorEmail,
    Status: Status,
    Reason: Reason,
  });
  makeAppointment.save((res, errr) => {
    // console.log(errr);
  });
  // }else{
  // console.log(err)
  // }
  // })
});

router.post("/allappoints", async (req, res) => {
  const { PatientEmail } = req.body;
  // console.log(PatientEmail);
  Appointment.find({ PatientEmail }).then((data, error) => {
    console.log(data);
    res.json({ data });
  });
});

//for doctor
router.post("/drallappoints", async (req, res) => {
  const { DoctorEmail } = req.body;
  // console.log(req.body);
  Appointment.find({ DoctorEmail }).then((data, error) => {
    // console.log(data)
    res.json({ data });
  });
});

// Conftim Appointment by doctor
router.post("/confirmappointments", async (req, res) => {
  const actualdata = [];
  const { DREmail } = req.body;
  // console.log(DREmail)
  Appointment.find(
    { DoctorEmail: DREmail, Status: "Pending" },
    async (err, data) => {
      // console.log(data);
      // data.map((curr,indx)=>{
      //   // console.log(curr.Status)
      //    if(curr.Status=='Pending'){
      //     // console.log(curr)
      //     //  actualdata.push(curr)
      //     return(res.json({dataset:curr}))
      //   }else{

      //   }
      //   console.log("ERROR "+err);
      //   console.log(actualdata)
      //   // return await(res.json({dataset:actualdata}))
      // })
      return res.json({ dataset: data });
    }
  );
});

router.post("/AcceptAppointment", (req, res) => {
  const { ID } = req.body;
  Appointment.findByIdAndUpdate(ID, { Status: "Completed" }, (err, res) => {
    console.log("Updated Status : ", res);
    if (res) {
      axios.get(`${Keys.WEEBMEET}/createmeetingforcovidweb`).then((response)=>{
        console.log(response.data.Meeting_ID)
        SendMail(res.PatientEmail,res.DoctorEmail,response.data.Meeting_ID,res.Doctorname,res.Patientname)
      }).catch((error)=>{
        console.log("Errror:  "+error)
      })
      // return res.json({ message: "Done" });
    } else {
      // console.log(err);
    }
  });
});

router.post("/RejectAppointment", (req, res) => {
  const { ID } = req.body;
  Appointment.findByIdAndUpdate(ID, { Status: "Removed" }, (res, err) => {
    if (err) {
      // console.log(err);
    } else {
      // console.log("Updated Status : ", err);
      return res.json({ message: "Done" });
    }
  });
});

module.exports = router;
