const Tags = require("../models/tagModel");

const tagCtrl = {
  addTag: async (req, res) => {
    try {
      const { name, color } = req.body;
      const tag = await Tags.findOne({ name });
      if (tag) {
        return res.status(400).json({ msg: "The tag already exists." });
      }

      const newTag = new Tags({ name, color });
      await newTag.save();
      const tags = await Tags.find({});
      res.json({ tags: tags, msg: `Tag ${name} created successfully.` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getTags: async (req, res) => {
    try {
      const tags = await Tags.find({});
      if (tags) {
        return res
          .status(200)
          .json({ tags: tags, msg: "fetched all tags successfully" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSingleTag: async (req, res) => {
    try {
      let id = req.query.id;
      const tag = await Tags.findOne({ _id: id });
      if (tag) {
        return res
          .status(200)
          .json({ tag: tag, msg: "fetched tag successfully" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteTag: async (req, res) => {
    try {
      let id = req.query.id;
      const tag = await Tags.findOneAndDelete({ _id: id });
      const tags = await Tags.find({});
      if (tag) {
        return res
          .status(200)
          .json({ tags: tags, msg: `Tag Deleted Successfully` });
      } else {
        return res.status(400).json({ msg: `No Tag With This Name` });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateTag: async (req, res) => {
    try {
      let id = req.query.id;
      const { tag } = req.body;
      const newTag = await Tags.findOneAndUpdate({ _id: id }, tag);
      const tags = await Tags.find({});
      if (newTag) {
        return res
          .status(200)
          .json({ msg: `Tag Updated  Successfully`, tags: tags });
      } else {
        return res.status(400).json({ msg: `No Tag With This Id` });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = tagCtrl;
