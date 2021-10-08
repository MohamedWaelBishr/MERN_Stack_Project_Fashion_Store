const Category = require("../models/categoryModel");
const Products = require("../models/productModel");

function createCategories(categories, parentID = null) {
  const categoryList = [];
  let category;
  if (parentID == null) {
    category = categories.filter((cat) => cat.parentID == undefined);
  } else {
    category = categories.filter((cat) => cat.parentID == parentID);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      tags: cate.tags,
      parentID: cate.parentID,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find({});
      if (categories) {
        //const categoryList = createCategories(categories);
        return res.status(200).json(categories);
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      // if user have role = 1 ---> admin
      // only admin can create , delete and update category
      const categoryObj = {
        name: req.body.name,
        parentID: "",
      };

      if (req.body.parentID) {
        categoryObj.parentID = req.body.parentID;
      }

      console.log(req.body.name, req.body.tags);
      const category = await Category.findOne({ name: categoryObj.name });
      if (category)
        return res.status(400).json({ msg: "This category already exists." });

      const newCategory = new Category({
        name: categoryObj.name,
        parentID: categoryObj.parentID,
      });

      await newCategory.save();
      res.json({ msg: `Category ${categoryObj.name} created successfully.` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const products = await Products.findOne({ category: req.params.id });
      if (products)
        return res.status(400).json({
          msg: "Please delete all products with a relationship to this category first.",
        });

      await Category.findByIdAndDelete(req.params.id);

      res.json({ msg: `Category Deleted Successfully.` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });

      res.json({ msg: `Category ${name} updated successfully.` });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryCtrl;
