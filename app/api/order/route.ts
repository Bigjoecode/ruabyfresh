import { NextResponse } from "next/server";

/**
 * Records a pre-order and returns a reference. Ruaby Fresh takes payment by
 * bank transfer (customers upload/attach their receipt on WhatsApp), so this
 * route just acknowledges the order and gives it a reference.
 *
 * Extend later: persist to a DB, or email the team via Resend/SendGrid by
 * reading an API key from env and sending the order summary here.
 */

type Line = { id: string; name: string; qty: number; price: number };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      reference?: string;
      lines: Line[];
      total: number;
      customer?: { name?: string; phone?: string };
    };

    if (!body.lines?.length) {
      return NextResponse.json({ ok: false, error: "Empty order" }, { status: 400 });
    }

    const reference =
      body.reference || "RUABY-" + Math.random().toString(36).slice(2, 7).toUpperCase();

    // Server-side record (visible in Vercel logs). Swap for DB/email as needed.
    console.log("[ruaby-order]", reference, {
      total: body.total,
      items: body.lines?.map((l) => `${l.qty}x ${l.name}`),
      customer: body.customer,
    });

    return NextResponse.json({ ok: true, reference });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Could not record order", detail: String(e) },
      { status: 500 }
    );
  }
}
