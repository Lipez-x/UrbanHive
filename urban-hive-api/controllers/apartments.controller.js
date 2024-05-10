const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const Apartment = require("../models/Apartment");
const mongoose = require("mongoose");

module.exports = class ApartmentController {
  static async create(req, res) {
    const { location, price, contact, description } = req.body;
    const images = req.files;
    const avaliable = true;

    if (!location) {
      res.status(422).json({ msg: "A localização é obrigatória." });
      return;
    }

    if (!price) {
      res.status(422).json({ msg: "O valor do imóvel é obrigatório." });
      return;
    }

    if (!contact) {
      res.status(422).json({ msg: "O meio de contato é obrigatório." });
      return;
    }

    if (!description) {
      res.status(422).json({ msg: "A descrição é obrigatória." });
      return;
    }

    if (images.length === 0) {
      res.status(422).json({ msg: "As imagens são obrigatórias." });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    const apartment = new Apartment({
      location,
      price,
      contact,
      description,
      avaliable,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      apartment.image.push(image.filename);
    });

    try {
      const newApartment = await apartment.save();
      res
        .status(201)
        .json({ msg: "Apartamento cadastrado com successo", newApartment });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async getAll(req, res) {
    const apartments = await Apartment.find().sort("-createdAt");

    res.status(200).json({ apartments: apartments });
  }

  static async getAllUserApartments(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const apartments = await Apartment.find({ "user._id": user._id }).sort(
      "-createdAt"
    );

    res.status(200).json({ apartments: apartments });
  }

  static async getAllUserLocations(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const apartments = await Apartment.find({ "lessee._id": user._id }).sort(
      "-createdAt"
    );

    res.status(200).json({ apartments: apartments });
  }

  static async getApartmentById(req, res) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422).json({ msg: "ID inválido" });
      return;
    }

    const apartment = await Apartment.findById(id);

    if (!apartment) {
      res.status(404).json({ msg: "Apartamento não encontrado" });
      return;
    }

    res.status(200).json({ apartment: apartment });
  }

  static async deleteApartmentById(req, res) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422).json({ msg: "ID inválido" });
      return;
    }

    const apartment = await Apartment.findById(id);

    if (!apartment) {
      res.status(404).json({ msg: "Apartamento não encontrado" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (apartment.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ msg: "Problema na solicitação" });
      return;
    }

    await Apartment.findByIdAndDelete(id);
    res.status(200).json({ msg: "Apartamento deletado com successo" });
  }

  static async updateApartment(req, res) {
    const id = req.params.id;

    const { location, price, contact, description, avaliable } = req.body;
    const images = req.files;

    const updatedData = {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422).json({ msg: "ID inválido" });
      return;
    }

    const apartment = await Apartment.findById(id);

    if (!apartment) {
      res.status(404).json({ msg: "Apartamento não encontrado" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (apartment.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ msg: "Problema na solicitação" });
      return;
    }

    if (!location) {
      res.status(422).json({ msg: "A localização é obrigatória." });
      return;
    } else {
      updatedData.location = location;
    }

    if (!price) {
      res.status(422).json({ msg: "O valor do imóvel é obrigatório." });
      return;
    } else {
      updatedData.price = price;
    }

    if (!contact) {
      res.status(422).json({ msg: "O meio de contato é obrigatório." });
      return;
    } else {
      updatedData.contact = contact;
    }

    if (!description) {
      res.status(422).json({ msg: "A descrição é obrigatória." });
      return;
    } else {
      updatedData.description = description;
    }

    if (images.length > 0) {
      updatedData.images = [];
      images.map((image) => {
        updatedData.images.push(image.filename);
      });
    }

    await Apartment.findByIdAndUpdate(id, updatedData);
    res.status(200).json({ msg: "Apartamento atualizado com successo" });
  }

  static async schedule(req, res) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422).json({ msg: "ID inválido" });
      return;
    }

    const apartment = await Apartment.findById(id);

    if (!apartment) {
      res.status(404).json({ msg: "Apartamento não encontrado" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (apartment.user._id.equals(user._id)) {
      res.status(422).json({
        msg: "Você não pode agendar uma visita ao seu próprio apartamento",
      });
      return;
    }

    if (apartment.lessee) {
      if (apartment.lessee._id.equals(user._id)) {
        res.status(422).json({
          msg: "Você já visitou este apartamento",
        });
        return;
      }
    }

    const updatedData = {
      lessee: {
        _id: user._id,
        name: user.name,
        image: user.image,
      },
    };

    await Apartment.findByIdAndUpdate(id, updatedData);

    res.status(200).json({
      msg: `A visita foi agendada com successo, entre em contato com ${apartment.user.name} por este telefone: ${apartment.user.phone}`,
    });
  }

  static async concludeLocation(req, res) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422).json({ msg: "ID inválido" });
      return;
    }

    const apartment = await Apartment.findById(id);

    if (!apartment) {
      res.status(404).json({ msg: "Apartamento não encontrado" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (apartment.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ msg: "Problema na solicitação" });
      return;
    }

    apartment.avaliable = false;

    await Apartment.findByIdAndUpdate(id, apartment);

    res.status(200).json({ msg: "Parabéns, o apartamento foi alugado." });
  }
};
