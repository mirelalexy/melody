import express from "express";
import multer from "multer"; // for post images
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 3000;
const upload = multer({ dest: 'images/' }); // the folder where we save images on the server

// array to store posts in memory (this version does not have a database)
let posts = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static("images"));

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
    const postId = uuidv4(); // generate UUID

    console.log("postTitle:", postTitle);
    console.log("postText:", postText);
    console.log("imagePath:", imagePath);
    console.log("postId:", postId);

    const newPost = {
        id: postId,
        title: postTitle,
        text: postText,
        image: imagePath,
        date: new Date().toLocaleDateString(), // get date
    }

    posts.push(newPost);
    console.log("Posts array:", posts);
    res.redirect("/home");
});

app.delete("/delete/:id", (req, res) => {
    const postId = req.params.id;
    const index = posts.findIndex(post => post.id === postId); // if post doesn't exist, it returns -1

    if (index !== -1) { // if post exists
        posts.splice(index, 1); // removing the post from the array
        // (starting from index, we delete 1 post)
        res.status(200).send("Post has been deleted");
    } else {
        res.status(404).send("Post not found");
    }
});

// load post data when user edits
app.get("/edit/:id", (req, res) => {
    const postId = req.params.id;
    console.log("Requested postId:", postId);
    const post = posts.find(post => post.id === postId); // search by ID to retrieve data

    if (post) {
        res.render("edit.ejs", { post: post }); // edit.ejs is populated with the data of the post with that ID
    } else {
        res.status(404).send("Post not found");
    }
});

// handle form submission and update the post
app.post("/edit/:id", upload.single('image'), (req, res) => {
    const postId = req.params.id;
    const { postTitle, postText } = req.body; // get the new title and text
    const imagePath = req.file ? req.file.path : ''; // handle optional image upload

    // find the index of the post to be updated
    const postIndex = posts.findIndex(post => post.id === postId);
    console.log("postIndex:", postIndex);

    if (postIndex !== -1) {
        // update the post with the new data
        posts[postIndex] = {
            id: postId,
            title: postTitle || posts[postIndex].title, // use new or keep the old one if left empty by user
            text: postText || posts[postIndex].text,
            image: imagePath || posts[postIndex].image,
            date: posts[postIndex].date, // preserve the original date
        };

        console.log("Updated posts array:", posts);
        res.redirect("/home");
    } else {
        res.status(404).send("Post not found");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});