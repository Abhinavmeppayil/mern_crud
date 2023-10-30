const express = require("express");
const app = express();
const PORT = 5000;
const { default: mongoose } = require("mongoose");
const cors = require('cors')

app.use(express.json());
app.use(cors())
// mongoose connection

mongoose
  .connect("mongodb://127.0.0.1:27017/CM")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
  });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// app.post("/createuser", async (req, res)=>{
//     try{
//         const bodyData = req.body;
//         const list = new User(bodyData)
//         const userData = await list.save()
//         res.send(userData)

//     }catch(error){
//         res.send(error)

//     }

// })

app.post("/createuser", async (req, res) => {
  try {
    const userData = await User.create(req.body); // Create and save the user in one step
    res.status(201).send(userData); // Send a 201 status code for resource creation
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Internal Server Error"); // Send a 500 status code for server errors
  }
});

app.get("/readalluser", async (req, res) => {
  try {
    const userData = await User.find({});
    res.send(userData);
  } catch (error) {
    res.send(error);
  }
});

app.get("/read/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById({ _id: id });
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

//update user

app.put("/updateuser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete({ _id: id });
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port   ${PORT}`);
});
