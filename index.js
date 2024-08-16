import express from "express";
import multer from "multer"; // for post images
import { v4 as uuidv4 } from "uuid";

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
    const postId = uuidv4();

    console.log("postTitle:", postTitle);
    console.log("postText:", postText);
    console.log("imagePath:", imagePath);
    console.log("postId:", postId);

    const newPost = {
        id: postId,
        title: postTitle,
        text: postText,
        image: imagePath,
        date: new Date().toLocaleDateString(),
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

app.get("/edit/:id", (req, res) => {
    const postId = req.params.id;
    console.log("Requested postId:", postId);
    console.log("Posts array:", posts); // checking if posts array is populated
    const post = posts.find(post => post.id === postId); // searching by ID again

    if (post) {
        res.render("edit.ejs", { post: post }); // create.ejs will be populated with the data of the post with that ID
    } else {
        res.status(404).send("Post not found");
    }
});

app.post("/edit/:id", upload.single('image'), (req, res) => {
    const postId = req.params.id;
    const {postTitle, postText} = req.body;
    const imagePath = req.file ? req.file.path : ''; // Handle optional image upload

        // Find the index of the post to be updated
        const postIndex = posts.findIndex(post => post.id === postId);

    console.log("postIndex:", postIndex);
    console.log("postTitle:", postTitle);
    console.log("postText:", postText);
    console.log("imagePath:", imagePath);
    console.log("postId:", postId);

    
    if (postIndex !== -1) {
        // Update the post with new data
        posts[postIndex] = {
            id: postId,
            title: postTitle,
            text: postText,
            image: imagePath || posts[postIndex].image, // Use existing image if no new one is provided
            date: posts[postIndex].date, // Preserve the original date
        };
    }
    
    console.log("Posts array:", posts);
    res.redirect("/home");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});