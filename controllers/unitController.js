import Unit from "../models/unitModel.js";

export const createUnit = async (req, res) => {
  try {
    const { orderUnit, packingUnit, weight } = req.body;
    const unit = await Unit.create({ orderUnit, packingUnit, weight });
    res.json({
      success: true,
      message: "Unit created successfully",
      unit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.findAll();
    res.render("unit", { units });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderUnit, packingUnit, weight } = req.body;

    const unitData = await Unit.findByPk(id);
    if (!unitData) {
      return res
        .status(404)
        .json({ success: false, message: "Unit not found" });
    }

    await unitData.update({ orderUnit, packingUnit, weight });

    res.json({
      success: true,
      message: "Unit updated successfully",
      unit: unitData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const unitData = await Unit.findByPk(id);
    if (!unitData) {
      return res
        .status(404)
        .json({ success: false, message: "Unit not found" });
    }
    await unitData.destroy();
    res.json({
      success: true,
      message: "Unit deleted successfully",
      unitId: id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
