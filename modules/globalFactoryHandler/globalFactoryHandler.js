import { catchAsync } from '../../units/catchSync.js';
import appError from '../../Error/appError.js';
import APIFeatures from '../Tours/apiFiltration.js';

export const getAll = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {};

    if (req.params.tourid) filter = { tour: req.params.tourid };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      // timee: req.requestTime,
      result: doc.length,
      data: doc,
    });
  });
export const getOne = (Model, popOption) =>
  catchAsync(async (req, res) => {
    const document = req.params.id;

    if (!document) {
      return res.status(400).json({ message: 'enter ID' });
    }
    let query = Model.findById(document);
    if (popOption) {
      query = query.populate(popOption);
    }

    let doc = await query;

    if (!doc) {
      return res.status(404).json({ message: ' document not found' });
    }

    res.status(200).json({ status: 'success', data: doc });
  });
export const addOne = (Model) =>
  catchAsync(async (req, res) => {
    const newItem = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc: newItem,
      },
    });
  });
export const UpdateOne = (Model) =>
  catchAsync(async (req, res) => {
    let DocID = req.params.id;

    if (!DocID) {
      return res.status(400).json({ status: ' fail', message: 'invalid Id' });
    }

    let Doc = await Model.findByIdAndUpdate(
      DocID,
      { ...req.body },
      { new: true },
      { runValidators: true }
    );
    if (!Doc) {
      return res
        .status(404)
        .json({ status: ' fail', message: ' Doc not found ' });
    }
    res.status(200).json({ status: ' success', data: Doc });
  });
export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let document = req.params.id;

    if (!document) {
      return res.status(400).json({ status: 'fail', message: ' invalid id ' });
    }
    if (!document) {
      return next(new appError('invalid id ', 400));
    }

    let deletedDocument = await Model.findByIdAndDelete(document);

    if (!deletedDocument) {
      return next(new appError('document not found  ', 404));
    }

    res.status(200).json({ status: 'success', message: ' document Deleted' });
  });
