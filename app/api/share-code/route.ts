import dbConnect from "@/app/lib/mongodb";
import Share from "@/app/models/Share";
import crypto from "crypto";

export async function POST(request: Request) {
  await dbConnect();

  const body = await request.json();
  const { codeContent, explainedCode, mode } = body;
  // create hash
  const hash = crypto
    .createHash("sha256")
    .update(codeContent + mode)
    .digest("hex");

  const shortId = hash.slice(0, 12);

  try {
    const existing = await Share.findOne({ hash });

    if (existing) {
      return Response.json({
        id: existing.shortId,
        message: "Already exists",
      });
    }
    console.log("shortId:", shortId);
    console.log("hash:", hash);
    const newShare = await Share.create({
      hash,
      shortId,
      codeContent,
      explainedCode,
      mode,
    });
    console.log("***** ", newShare);
    return Response.json({
      id: newShare.shortId,
      message: "Saved successfully",
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
