import Package from "../models/packageModel.js";

export const createPackage = async (req, res) => {
  try {
    const { unit, netWeight, grossWeight } = req.body;
    const packageData = await Package.create({ unit, netWeight, grossWeight });
    res.json({
      success: true,
      message: "Package created successfully",
      package: packageData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    res.render("package", { packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit, netWeight, grossWeight } = req.body;
    const packageData = await Package.findByPk(id);
    if (!packageData) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }
    await packageData.update({ unit, netWeight, grossWeight });
    res.json({
      success: true,
      message: "Package updated successfully",
      package: packageData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const packageData = await Package.findByPk(id);
    if (!packageData) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }
    await packageData.destroy();
    res.json({
      success: true,
      message: "Package deleted successfully",
      packageId: id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
