//models
const posts = [
    {
        "id": 1,
        "author": "Tomer",
        "timestamp": "July 17 at 1:23 pm",
        "text": "Here's my first post!",
        "imageUrl": "https://source.unsplash.com/random/100",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=1&profile"
    },
    {
        "id": 2,
        "author": "Alice",
        "timestamp": "July 18 at 2:30 pm",
        "text": "Another day, another adventure.",
        "imageUrl": "https://source.unsplash.com/random/101",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=2&profile"
    },
    {
        "id": 3,
        "author": "Bob",
        "timestamp": "July 18 at 5:30 pm",
        "text": "Got Accepted to Harvard!",
        "imageUrl": "https://source.unsplash.com/random/102",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=3&profile"
    },
    {
        "id": 4,
        "author": "Yosi",
        "timestamp": "July 24 at 2:30 pm",
        "text": "I'm so lucky!",
        "imageUrl": "https://source.unsplash.com/random/103",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=4&profile"
    },
    {
        "id": 5,
        "author": "Ofek",
        "timestamp": "July 20 at 4:30 am",
        "text": "Love my mom!",
        "imageUrl": "https://source.unsplash.com/random/104",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=5&profile"
    },
    {
        "id": 6,
        "author": "Michael",
        "timestamp": "March 18 at 7:30 pm",
        "text": "I love dogs",
        "imageUrl": "https://source.unsplash.com/random/105",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=6&profile"
    },
    {
        "id": 7,
        "author": "Ziv",
        "timestamp": "February 1 at 6:30 pm",
        "text": "I love food",
        "imageUrl": "https://source.unsplash.com/random/106",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=7&profile"
    },
    {
        "id": 8,
        "author": "Ronit",
        "timestamp": "March 11 at 2:30 pm",
        "text": "Love myself so much!",
        "imageUrl": "https://source.unsplash.com/random/107",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=8&profile"
    },
    {
        "id": 9,
        "author": "Amit",
        "timestamp": "July 30 at 2:30 pm",
        "text": "Im such a good kisser",
        "imageUrl": "https://source.unsplash.com/random/108",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=9&profile"
    },
    {
        "id": 10,
        "author": "Dolev",
        "timestamp": "September 11 at 2:30 pm",
        "text": "Rip twin towers",
        "imageUrl": "https://source.unsplash.com/random/109",
        "profilePic": "https://source.unsplash.com/random/300x300?sig=10&profile"
    }]

function getPosts() {
    return posts;
}
function getPost(id) {
    for (const i in posts) {
        const post = posts[i]
        if (post.id == id) {
            return post;
        }
    }
    return null;
}

export default{
    getPosts,
    getPost
}



