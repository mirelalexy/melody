import express from "express";
import multer from "multer"; // for post images

const app = express();
const port = 3000;
const upload = multer({ dest: 'images/' }); // the folder where we save images on the server

// array to store posts in memory
let posts = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('images'));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/home", (req, res) => {
    res.render("home.ejs", {posts: posts});
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});

app.post("/home", upload.single('image'), (req, res) => {
    const {postTitle, postText} = req.body;
    const imagePath = req.file.path;

    console.log("postTitle:", postTitle);
    console.log("postText:", postText);
    console.log("imagePath:", imagePath);

    const newPost = {
        title: postTitle,
        text: postText,
        image: imagePath,
        date: new Date().toLocaleDateString(),
    }

    posts.push(newPost);
    res.redirect("/home");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});