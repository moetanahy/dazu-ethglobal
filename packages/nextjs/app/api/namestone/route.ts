import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_KEY = "037f4da9-82e7-43e1-a338-46c40d1fd715";
const BASE_URL = "https://namestone.xyz/api/public_v1";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  try {
    const response = await axios.get(`${BASE_URL}/get-names`, {
      headers: {
        "X-API-Key": API_KEY,
        Authorization: API_KEY,
      },
      params: Object.fromEntries(searchParams),
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { message: "Internal server error" }, {
      status: error.response?.status || 500,
    });
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);

  try {
    const body = await request.json();
    const response = await axios.post(`${BASE_URL}${url.pathname.replace("/api/namestone", "")}`, body, {
      headers: {
        "X-API-Key": API_KEY,
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(error.response?.data || { message: "Internal server error" }, {
      status: error.response?.status || 500,
    });
  }
}
