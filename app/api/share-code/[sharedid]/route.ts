import dbConnect from "@/app/lib/mongodb";
import Share from "@/app/models/Share";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sharedid: string }> },
) {
  await dbConnect();

  const { sharedid } = await params; // ✅ important

  const existing = await Share.findOne({ shortId: sharedid });

  console.log("param:", sharedid);
  console.log("###### ", { existing });

  if (existing) {
    return Response.json({
      content: existing,
      message: "Got Shared Data",
    });
  }

  return Response.json({
    content: null,
    message: "No match found",
  });
}
