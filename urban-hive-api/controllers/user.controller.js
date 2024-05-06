const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class UserController {
  static async editUser(req, res) {
    const id = req.params.id;

    const token = getToken(req);

    const user = getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;
    let image = "";

    if (req.file) {
      user.image = req.file.filename;
    }

    if (!name) {
      res.status(422).json({ msg: "O nome é obrigatório" });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ msg: "O email é obrigatório" });
      return;
    }

    const userExists = await User.findOne({ email: email });

    if (user.email !== userExists && userExists) {
      res.status(422).json({ msg: "Já existe um usuário com este email" });
      return;
    }

    user.email = email;

    if (!phone) {
      res.status(422).json({ msg: "O telefone é obrigatório" });
      return;
    }

    user.phone = phone;

    if (password !== confirmpassword) {
      res
        .status(422)
        .json({ msg: "A senha e a confirmação de senha precisam ser iguais" });
      return;
    } else if (password === confirmpassword && password != null) {
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(password, salt);

      user.password = hashPassword;
    }

    try {
      await User.findOneAndUpdate({ _id: id }, { $set: user }, { new: true });

      res.status(200).json({ msg: "Usuário atualizado com sucesso" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async getUserById(req, res) {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ msg: "ID de usuário não encontrado" });
    }

    try {
      user.password = undefined;
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ msg: "O email é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ msg: "A senha é obrigatória" });
      return;
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({ msg: "Não existe um usuário com este email" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ msg: "Senha incorreta" });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    if (!name) {
      res.status(422).json({ msg: "O nome é obrigatório" });
      return;
    }

    if (!email) {
      res.status(422).json({ msg: "O email é obrigatório" });
      return;
    }

    if (!phone) {
      res.status(422).json({ msg: "O telefone é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ msg: "A senha é obrigatória" });
      return;
    }

    if (!confirmpassword) {
      res.status(422).json({ msg: "Confirmar senha é obrigatório" });
      return;
    }

    if (password !== confirmpassword) {
      res
        .status(422)
        .json({ msg: "A senha e a confirmação de senha precisam ser iguais" });
      return;
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({ msg: "Já existe um usuário com este email" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      password: hashPassword,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  }
};
