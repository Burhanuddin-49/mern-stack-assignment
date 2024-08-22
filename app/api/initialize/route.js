import { NextResponse } from "next/server";
import connectDB from "../../../libs/mongodb";
import Product from "../../../models/product";

export async function GET() {
  await connectDB();

  try {
    const response = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = await response.json();
    await Product.deleteMany({});
    await Product.insertMany(data);

    return NextResponse.json(
      {
        message: "Database initialized successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    );
  }
}
