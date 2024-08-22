import connectDB from "../../../libs/mongodb";
import Product from "../../../models/product";
import statisticsHandler from "../statistics/route";
import barChartHandler from "../bar-chart/route";
import pieChartHandler from "../pie-chart/route";

export default async function GET(req, res) {
  await connectDB();

  const { month } = req.query;

  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      statisticsHandler(req, res),
      barChartHandler(req, res),
      pieChartHandler(req, res),
    ]);

    res.status(200).json({ statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch combined data" });
  }
}
