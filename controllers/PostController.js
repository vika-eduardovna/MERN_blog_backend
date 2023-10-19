import Post from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().populate('user').exec();
        res.json(posts);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving posts' })
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: { viewsCount: 1 } },
            { new: true } // This option returns the modified document
        ).exec();

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post is not found' });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving posts' });
    }
};


export const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();
        res.json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Creating an article failed' })
    }
};


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await Post.findOneAndDelete({ _id: postId }).exec();

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post is not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while deleting posts' });
    }
};


export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await Post.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            },
        );

        res.json({ message: true })
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while updating posts' });
    }

};

export const getLastTags = async (req, res) => {
    try {
        const posts = await Post.find().limit(5).exec();
        const tags = posts
            .map(obj => obj.tags)
            .flat()
            .slice(0, 6);

        res.json(tags);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving posts' })
    }
}