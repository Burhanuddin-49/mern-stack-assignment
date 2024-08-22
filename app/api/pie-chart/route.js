import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import Product from "../../../models/product";

export async function GET(req) {
  await connectDB();

  const searchParams = req.nextUrl.searchParams;
  const month = parseInt(searchParams.get("month")) || 3;

  const monthFilter = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
  };

  try {
    const pieChartData = await Product.aggregate([
      { $match: monthFilter },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    NextResponse.json({ pieChartData }, { status: 200 });
  } catch (error) {
    NextResponse.json(
      { error: "Failed to fetch pie chart data" },
      { status: 500 }
    );
  }
}
