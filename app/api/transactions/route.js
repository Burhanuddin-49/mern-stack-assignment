import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import Product from "../../../models/product";

export async function GET(req) {
  await connectDB();

  // const searchParams = req.nextUrl.searchParams;
  // const page = parseInt(searchParams.get("page")) || 1;
  // const perPage = parseInt(searchParams.get("perPage")) || 10;
  // const search = searchParams.get("search") || "";
  // const month = parseInt(searchParams.get("month")) || 3;

  const page = 1,
    perPage = 10,
    search = "",
    month = 3;

  const monthFilter = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, month] },
  };

  const searchFilter = search
    ? {
        $or: [
          { title: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
          { price: new RegExp(search, "i") },
        ],
      }
    : {};
  console.log(searchFilter);

  try {
    const transactions = await Product.find({ ...monthFilter, ...searchFilter })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
