const { Contact } = require('../models/contact');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res) => {
  const { page = 1, limit = 20, favorite = null } = req.query;
  const filter = {
    owner: req.user._id,
  };
  const options = {
    skip: (page - 1) * limit,
    limit,
  };
  if (favorite !== null) filter.favorite = favorite;
  const result = await Contact.find(filter, '-createdAt -updatedAt', options).populate(
    'owner',
    'name email'
  );
  const processedResult = result.map(({ _id: id, name, number }) => {
    return { id, name, number };
  });
  res.json(processedResult);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  console.log(result);
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const owner = req.user._id;
  const result = await Contact.create({ ...req.body, owner });
  const { _id: id, name, number } = result;
  res.status(201).json({ id, name, number });
};

const updateContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
  res.json(result);
};

const updateFavoriteById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, `Contact with ${id} not found`);
  }
  res.json(result);
};

const deleteContactById = async (req, res) => {
  const { id: contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  const { _id: id, name, number } = result;
  res.json({ id, name, number });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getContactById),
  add: ctrlWrapper(addContact),
  updateById: ctrlWrapper(updateContactById),
  updateFavoriteById: ctrlWrapper(updateFavoriteById),
  deleteById: ctrlWrapper(deleteContactById),
};
