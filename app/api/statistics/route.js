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
    const totalSaleAmount = await Product.aggregate([
      { $match: monthFilter },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Product.countDocuments({
      ...monthFilter,
      sold: true,
    });
    const totalNotSoldItems = await Product.countDocuments({
      ...monthFilter,
      sold: false,
    });

    NextResponse.json(
      {
        totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
        totalSoldItems,
        totalNotSoldItems,
      },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}
