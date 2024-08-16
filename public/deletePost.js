function deletePost(id) {
    fetch(`/delete/${id}`, { // more about using fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            window.location.reload(); // reloading the page to reflect the changes
        } else {
            console.log("Error: Could not delete post");
        }
    })
    .catch(err => console.error("Error:", err)); // if there's an error during the fetch request, we catch and log it
}