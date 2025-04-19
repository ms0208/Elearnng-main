import Interaction from '../models/interaction.js';

export const createInteraction = async (req, res) => {
  try {
    const interaction = new Interaction(req.body);
    const saved = await interaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInteractions = async (req, res) => {
  const data = await Interaction.find();
  res.json(data);
};
