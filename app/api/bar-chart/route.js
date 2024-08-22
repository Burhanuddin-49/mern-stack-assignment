import connectDB from "../../../libs/mongodb";
import Product from "../../../models/product";

export default async function GET(req, res) {
  await connectDB();

  const { month } = req.query;

  const monthFilter = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
  };

  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  try {
    const barChartData = await Promise.all(
      priceRanges.map(async ({ min, max }) => {
        const count = await Product.countDocuments({
          ...monthFilter,
          price: { $gte: min, $lte: max },
        });
        return { priceRange: `${min}-${max}`, count };
      })
    );

    res.status(200).json(barChartData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bar chart data" });
  }
}
